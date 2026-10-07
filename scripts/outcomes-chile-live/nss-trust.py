#!/usr/bin/env python3
"""Import one pinned public CA into a new, private NSS database. Never use a user database."""
import ctypes
import ctypes.util
import hashlib
import json
import os
from pathlib import Path
import ssl
import stat
import sys


class Failure(Exception):
    pass


def require(condition, code):
    if not condition:
        raise Failure(code)


class SECItem(ctypes.Structure):
    _fields_ = [('type', ctypes.c_uint), ('data', ctypes.POINTER(ctypes.c_ubyte)), ('len', ctypes.c_uint)]


class CERTCertTrust(ctypes.Structure):
    _fields_ = [('sslFlags', ctypes.c_uint), ('emailFlags', ctypes.c_uint), ('objectSigningFlags', ctypes.c_uint)]


def main():
    os.umask(0o077)
    config = json.loads(sys.stdin.read(32 * 1024))
    root = Path(config['root'])
    require(root.is_absolute() and root.name.startswith('dtc-browser-trust-') and root.resolve() == root, 'NSS_TEMP_ROOT_INVALID')
    info = root.lstat()
    require(stat.S_ISDIR(info.st_mode) and not root.is_symlink() and info.st_uid == os.getuid() and stat.S_IMODE(info.st_mode) == 0o700, 'NSS_TEMP_ROOT_NOT_PRIVATE')
    marker = root / 'dtc-public-ca-only'
    require(marker.is_file() and not marker.is_symlink() and marker.read_text() == config['fingerprint'], 'NSS_TEMP_MARKER_INVALID')
    require(sorted(p.name for p in root.iterdir()) == ['dtc-public-ca-only'], 'NSS_TEMP_ROOT_NOT_EMPTY')
    pem = Path(config['certificatePath']).read_text()
    require(pem.count('-----BEGIN CERTIFICATE-----') == 1 and 'PRIVATE KEY' not in pem, 'NSS_SINGLE_PUBLIC_CA_REQUIRED')
    der = ssl.PEM_cert_to_DER_cert(pem)
    require(hashlib.sha256(der).hexdigest() == config['fingerprint'], 'NSS_CA_FINGERPRINT_MISMATCH')
    database = root / 'pki' / 'nssdb'
    database.mkdir(parents=True, mode=0o700)
    os.chmod(database.parent, 0o700)
    library = ctypes.util.find_library('nss3')
    require(library is not None, 'NSS_LIBRARY_UNAVAILABLE')
    nss = ctypes.CDLL(library)

    def api(name, result, arguments):
        function = getattr(nss, name)
        function.restype = result
        function.argtypes = arguments
        return function

    pointer = ctypes.c_void_p
    init = api('NSS_InitReadWrite', ctypes.c_int, [ctypes.c_char_p])
    shutdown = api('NSS_Shutdown', ctypes.c_int, [])
    get_db = api('CERT_GetDefaultCertDB', pointer, [])
    get_slot = api('PK11_GetInternalKeySlot', pointer, [])
    needs_pin = api('PK11_NeedUserInit', ctypes.c_int, [pointer])
    init_pin = api('PK11_InitPin', ctypes.c_int, [pointer, ctypes.c_char_p, ctypes.c_char_p])
    free_slot = api('PK11_FreeSlot', None, [pointer])
    new_cert = api('CERT_NewTempCertificate', pointer, [pointer, ctypes.POINTER(SECItem), ctypes.c_char_p, ctypes.c_int, ctypes.c_int])
    import_cert = api('PK11_ImportCert', ctypes.c_int, [pointer, pointer, ctypes.c_ulong, ctypes.c_char_p, ctypes.c_int])
    decode_trust = api('CERT_DecodeTrustString', ctypes.c_int, [ctypes.POINTER(CERTCertTrust), ctypes.c_char_p])
    change_trust = api('CERT_ChangeCertTrust', ctypes.c_int, [pointer, pointer, ctypes.POINTER(CERTCertTrust)])
    read_trust = api('CERT_GetCertTrust', ctypes.c_int, [pointer, ctypes.POINTER(CERTCertTrust)])
    destroy_cert = api('CERT_DestroyCertificate', None, [pointer])
    require(init(('sql:' + str(database)).encode()) == 0, 'NSS_INIT_FAILED')
    slot = None
    certificate = None
    try:
        db = get_db()
        slot = get_slot()
        require(db and slot, 'NSS_DATABASE_OR_SLOT_MISSING')
        if needs_pin(slot):
            require(init_pin(slot, None, b'') == 0, 'NSS_EMPTY_DATABASE_INIT_FAILED')
        buffer = (ctypes.c_ubyte * len(der)).from_buffer_copy(der)
        item = SECItem(0, buffer, len(der))
        certificate = new_cert(db, ctypes.byref(item), None, 0, 1)
        require(certificate, 'NSS_CA_DECODE_FAILED')
        # CK_INVALID_HANDLE = 0: no private key is imported. Trust is assigned explicitly below.
        require(import_cert(slot, certificate, 0, b'DTC managed public CA', 0) == 0, 'NSS_CA_IMPORT_FAILED')
        expected = CERTCertTrust()
        require(decode_trust(ctypes.byref(expected), b'C,,') == 0, 'NSS_TRUST_PARSE_FAILED')
        require(change_trust(db, certificate, ctypes.byref(expected)) == 0, 'NSS_TRUST_WRITE_FAILED')
        observed = CERTCertTrust()
        require(read_trust(certificate, ctypes.byref(observed)) == 0, 'NSS_TRUST_READ_FAILED')
        require((observed.sslFlags, observed.emailFlags, observed.objectSigningFlags)
                == (expected.sslFlags, expected.emailFlags, expected.objectSigningFlags), 'NSS_TRUST_READBACK_MISMATCH')
    finally:
        if certificate:
            destroy_cert(certificate)
        if slot:
            free_slot(slot)
        require(shutdown() == 0, 'NSS_SHUTDOWN_FAILED')
    print(json.dumps({'status': 'CREATED', 'fingerprint': config['fingerprint'], 'publicCertificatesImported': 1, 'trust': 'C,,'}))


try:
    main()
except Exception as error:
    print(json.dumps({'status': 'FAILED', 'code': str(error) if isinstance(error, Failure) else 'NSS_SETUP_FAILED'}))
    sys.exit(1)

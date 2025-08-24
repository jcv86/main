import SessionWrapper from "@/components/session-wrapper"

async function checkLocalSession() {
  // Esta función se ejecuta en el servidor, así que no puede acceder a localStorage
  // La verificación de sesión local se hará en el cliente
  return null
}

export default function HomePage() {
  return <SessionWrapper />
}

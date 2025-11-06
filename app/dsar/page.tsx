"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Download, Trash2, FileText, CheckCircle } from "lucide-react"

export default function DSARRequestPage() {
  const [step, setStep] = useState<"form" | "verify" | "success">("form")
  const [email, setEmail] = useState("")
  const [requestType, setRequestType] = useState<"access" | "deletion" | "portability">("access")
  const [reason, setReason] = useState("")
  const [requestId, setRequestId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmitRequest = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/dsar/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          requestType,
          requestReason: reason,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      setRequestId(data.requestId)
      setStep("verify")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/dsar/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify request")
      }

      setStep("success")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8 text-center">
        <Shield className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Data Subject Access Request</h1>
        <p className="text-muted-foreground mt-2">Exercise your GDPR rights regarding your personal data</p>
      </div>

      {step === "form" && (
        <Card>
          <CardHeader>
            <CardTitle>Submit a DSAR Request</CardTitle>
            <CardDescription>Request access to, deletion of, or export of your personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Request Type</Label>
              <RadioGroup value={requestType} onValueChange={(v: any) => setRequestType(v)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="access" id="access" />
                  <Label htmlFor="access" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Download className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Access My Data</div>
                      <div className="text-sm text-muted-foreground">Request a copy of all your personal data</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="deletion" id="deletion" />
                  <Label htmlFor="deletion" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Trash2 className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Delete My Data</div>
                      <div className="text-sm text-muted-foreground">
                        Request permanent deletion of your personal data
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="portability" id="portability" />
                  <Label htmlFor="portability" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Data Portability</div>
                      <div className="text-sm text-muted-foreground">Export your data in a machine-readable format</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

            <Button onClick={handleSubmitRequest} disabled={!email || loading} className="w-full">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You will receive a verification code via email to confirm your identity
            </p>
          </CardContent>
        </Card>
      )}

      {step === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Request</CardTitle>
            <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

            <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || loading} className="w-full">
              {loading ? "Verifying..." : "Verify Request"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "success" && (
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Request Submitted Successfully</CardTitle>
            <CardDescription className="text-center">Your DSAR request has been verified and submitted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-accent rounded-lg space-y-2">
              <p className="text-sm font-medium">What happens next?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Our team will process your request within 72 hours</li>
                <li>• You will receive an email notification when processing is complete</li>
                {requestType === "access" && <li>• Your data export will be available for download for 7 days</li>}
                {requestType === "deletion" && (
                  <li>• Your data will be permanently deleted after a 30-day grace period</li>
                )}
              </ul>
            </div>

            <p className="text-xs text-muted-foreground text-center">Request ID: {requestId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

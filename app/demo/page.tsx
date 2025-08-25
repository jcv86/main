import { redirect } from "next/navigation"

export default function DemoPage() {
  redirect("/test/disc/results?demo=true")
}

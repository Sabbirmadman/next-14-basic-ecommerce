import { Loader2 } from "lucide-react";


export default function adminLoading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin size-24" />
    </div>
  )
}

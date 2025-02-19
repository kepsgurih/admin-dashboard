import { Cog } from "lucide-react"

export default function UnderMaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-blue-500 p-3">
            <Cog className="h-12 w-12 animate-spin text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Under Maintenance</h1>
        <p className="mb-8 text-xl text-gray-600">
          We're currently performing some scheduled maintenance. We'll be back up and running as soon as possible.
        </p>
      </div>
    </div>
  )
}


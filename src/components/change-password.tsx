import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your old password and new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
            <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Old Password</Label>
                </div>
                <Input id="oldPassword" type="password" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">New Password</Label>
                </div>
                <Input id="newPassword" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

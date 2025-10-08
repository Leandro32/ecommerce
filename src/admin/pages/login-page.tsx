import React from "react";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('redirect') || "/admin/dashboard";

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Icon icon="lucide:shopping-bag" className="text-primary text-xl" />
            </div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="text-sm text-gray-500">Sign in to your admin account</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                placeholder="admin@example.com"
                type="email"
                value={email}
                onValueChange={setEmail}
                isRequired
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                value={password}
                onValueChange={setPassword}
                isRequired
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  Sign In
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500">
                <p>Demo credentials: admin@example.com / password</p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
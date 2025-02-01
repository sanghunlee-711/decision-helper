import { useTransition } from "react";
import { Button } from "./button"
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LinkButtonProps{
    path: string;
    children: React.ReactNode;
}

export const LinkButton = ({path, children}: LinkButtonProps)=> {
  const[isPending, startTransition] = useTransition()
  const router = useRouter()

    return (
        <Button
          variant="outline"
          onClick={() => startTransition(() => router.push(`${path}`))}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin mr-2" /> : children}
        </Button>
    )
}
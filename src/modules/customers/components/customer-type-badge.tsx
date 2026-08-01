import { Badge } from "@/shared/components/ui/badge";

interface Props {
  type: "online" | "walk_in";
}

export function CustomerTypeBadge({ type }: Props) {
  if (type === "online") {
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 font-medium">Online</Badge>;
  }
  return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 font-medium">Walk-in</Badge>;
}

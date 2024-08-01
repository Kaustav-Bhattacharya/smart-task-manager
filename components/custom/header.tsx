"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation";

type Props = {
    heading: string
}

const Header = ({heading}: Props) => {
    const router = useRouter();
  return (
    <div className="flex items-center gap-5 shadow-lg p-5">
        <ArrowLeft onClick={() => router.back()} />
        <h1 className="font-semibold text-2xl">
          {heading}
        </h1>
      </div>
  )
}

export default Header
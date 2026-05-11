"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                data-state={checked ? "checked" : "unchecked"}
                className={cn(
                    "peer relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-rose-600",
                    className
                )}
                onClick={() => onCheckedChange?.(!checked)}
                ref={ref}
                {...props}
            >
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <span className={cn(
                        "text-[9px] font-bold text-white uppercase transition-all duration-200",
                        checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    )}>
                        ON
                    </span>
                    <span className={cn(
                        "text-[9px] font-bold text-white uppercase transition-all duration-200",
                        checked ? "opacity-0 scale-50" : "opacity-100 scale-100"
                    )}>
                        OFF
                    </span>
                </div>
                <span
                    data-state={checked ? "checked" : "unchecked"}
                    className={cn(
                        "pointer-events-none z-10 block h-5 w-5 rounded-full bg-card shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
                    )}
                />
            </button>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }

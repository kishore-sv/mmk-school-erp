"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useAnimate, useReducedMotion } from "motion/react"
import React, { useState } from "react"

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  className?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  onAfterSuccess?: () => void
}

export const Button = ({
  className,
  children,
  onAfterSuccess,
  ...props
}: ButtonProps) => {
  const [scope, animate] = useAnimate()
  const reduceMotion = useReducedMotion()
  const [busy, setBusy] = useState(false)

  const animateLoading = async () => {
    await animate(
      ".loader",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      }
    )
  }

  const animateSuccess = async () => {
    await animate(
      ".loader",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        duration: 0.2,
      }
    )
    await animate(
      ".check",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      }
    )

    await animate(
      ".check",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        delay: 2,
        duration: 0.2,
      }
    )
  }

  const resetIndicators = async () => {
    await animate(".loader", { width: "0px", scale: 0, display: "none" }, { duration: 0.15 })
    await animate(".check", { width: "0px", scale: 0, display: "none" }, { duration: 0.15 })
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (busy || props.disabled) return
    setBusy(true)
    try {
    if (reduceMotion) {
      await props.onClick?.(event)
      onAfterSuccess?.()
      return
    }
    await animateLoading()
    await props.onClick?.(event)
    await animateSuccess()
    onAfterSuccess?.()
  } catch {
    await resetIndicators()
  } finally {
    setBusy(false)
  }
  }

  const { onClick, onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, disabled, ...buttonProps } =
    props

  return (
    <motion.button
      layout
      layoutId="stateful-submit-button"
      ref={scope}
      type="button"
      disabled={disabled || busy}
      className={cn(buttonVariants({ variant: "default" }), "min-w-[120px] cursor-pointer", className)}
      {...buttonProps}
      onClick={handleClick}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader reduceMotion={reduceMotion ?? false} />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  )
}

const Loader = ({ reduceMotion }: { reduceMotion: boolean }) => {
  return (
    <motion.svg
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: [0, 360],
            }
      }
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      transition={{
        duration: 0.3,
        repeat: reduceMotion ? 0 : Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-current"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  )
}

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-current"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  )
}
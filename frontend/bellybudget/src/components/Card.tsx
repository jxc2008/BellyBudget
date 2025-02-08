import type React from "react"

interface CardProps {
  children: React.ReactNode
}

export function Card({ children }: CardProps) {
  return <div className="card">{children}</div>
}

export function CardContent({ children }: CardProps) {
  return <div className="card-content">{children}</div>
}


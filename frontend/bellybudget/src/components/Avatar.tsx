interface AvatarProps {
    src: string
    alt: string
  }
  
  export function Avatar({ src, alt }: AvatarProps) {
    return <img className="avatar" src={src || "/placeholder.svg"} alt={alt} />
  }
  
  
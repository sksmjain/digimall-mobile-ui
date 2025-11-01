interface ButtonProps {
    label?: string; // now optional
    children?: React.ReactNode; // allow icons / custom content
    active?: boolean;
    onClick?: () => void;
    variant?: "default" | "primary" | "ghost" | "outline" | "destructive" | "text";
    size?: "xs" | "sm" | "md" | "lg";
    pill?: boolean;
  }
  
  export default function Button({
    label,
    children,
    active,
    onClick,
    variant = "default",
    size = "xs",
    pill = true,
  }: ButtonProps) {
    const v = {
      default: "btn",
      primary: "btn btn-primary",
      ghost: "btn btn-ghost",
      outline: "btn btn-outline",
      destructive: "btn btn-destructive",
      text: "btn-text"
    }[variant];
  
    const s = {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    }[size];
  
    return (
      <button
        onClick={onClick}
        className={`${v} ${s} ${pill ? "btn-pill" : ""} ${active ? "btn-active" : ""}`}
      >
        {children ?? label}
      </button>
    );
  }
  
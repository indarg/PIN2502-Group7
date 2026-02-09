
type Props = {
    reverse?:boolean
}

export default function GradientDivider({reverse}: Props) {
  return (
    <div style={{width:"100%",height:"15px",background:"var(--banner-gradient)", margin:"20px 0"}}>
    </div>
  )
}
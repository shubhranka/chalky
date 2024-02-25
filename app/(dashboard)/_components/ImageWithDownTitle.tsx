import Image from "next/image"

interface ImageWithDownTitleProps {
    src:string
    title:string
}

const ImageWithDownTitle = ({src,title}:ImageWithDownTitleProps) => (
    <div className="flex flex-col items-center justify-center">

        <Image alt="Empty Org" src={src} width={300} height={300} />

        <h2 className="text-2xl font-semibold">
            {title}
        </h2>
    </div>
)

export default ImageWithDownTitle

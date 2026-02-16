import './LoadingScreen.css'


export default function LoadingScreen() {
    return (
        <body className="loader">
            {/* <svg width="600" height="300" viewBox="0 0 600 300">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="red" />
                        <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="red" />
                    </filter>
                </defs>
                <path
                    className="glow-path"
                    d="M50 50 H500 Q550 50 550 100 V200 Q550 250 500 250 H50"
                />
            </svg> */}
            {/* <div className="neon-curve"></div> */}
            {/* <div className="svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="1423" height="1423" viewBox="0 0 1423 1423" fill="none">
                    <defs>
                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blurred-glow" />

                            <feFlood flood-color="#8A2BE2" flood-opacity="1" result="flood-color" />

                            <feComposite in="flood-color" in2="blurred-glow" operator="in" result="colored-glow" />

                            <feMerge>
                                <feMergeNode in="SourceGraphic" /> <feMergeNode in="colored-glow" />  </feMerge>
                        </filter>
                    </defs>

                    <rect className="base-rect" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" transform="rotate(45 80.0732 -33)" />

                    <defs>
                        <clipPath id="moving-glow-clip">
                            <rect x="0" y="0" width="200" height="100%" /> </clipPath>
                    </defs>

                    <g transform="rotate(45 80.0732 -33)">
                        <rect className="glow-path" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" fill="#8A2BE2" />
                    </g>

                    <g clip-path="url(#glow-clip-path)" className="animated-glow-container">
                        <rect className="glow-path-animated" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" transform="rotate(45 80.0732 -33)" fill="#8A2BE2" style={{filter: "url(#neon-glow)"}} />
                    </g>

                    <defs>
                        <clipPath id="glow-clip-path">
                            <rect id="moving-window" x="0" y="0" width="300" height="100%" /> </clipPath>
                    </defs>

                </svg> */}
            {/* </div> */}
            <div className="carbon-fiber-background"></div>

            <div className="container">
                <h1 className="neon-text">MOTORIZANDO</h1>

                <div className="background-glow"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="1423" height="1423" viewBox="0 0 1423 1423" fill="none">
                    <defs>
                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blurred-glow" />

                            <feFlood flood-color="#8A2BE2" flood-opacity="1" result="flood-color" />

                            <feComposite in="flood-color" in2="blurred-glow" operator="in" result="colored-glow" />

                            <feMerge>
                                <feMergeNode in="SourceGraphic" /> <feMergeNode in="colored-glow" />  </feMerge>
                        </filter>
                    </defs>

                    <rect className="base-rect" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" transform="rotate(45 80.0732 -33)" />

                    <defs>
                        <clipPath id="moving-glow-clip">
                            <rect x="0" y="0" width="200" height="100%" /> </clipPath>
                    </defs>

                    <g transform="rotate(45 80.0732 -33)">
                        <rect className="glow-path" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" fill="#8A2BE2" />
                    </g>

                    <g clip-path="url(#glow-clip-path)" className="animated-glow-container">
                        <rect className="glow-path-animated" x="80.0732" y="-33" width="1945" height="159.909" rx="79.9547" transform="rotate(45 80.0732 -33)" fill="#8A2BE2" style={{ filter: "url(#neon-glow)" }} />
                    </g>

                    <defs>
                        <clipPath id="glow-clip-path">
                            <rect id="moving-window" x="0" y="0" width="300" height="100%" /> </clipPath>
                    </defs>

                </svg>
            </div>
        </body>
    )
}
/**
 * Made with 💛 by Karim Saif
 *
 * @framerIntrinsicWidth 230
 * @framerIntrinsicHeight 60
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion } from "framer-motion"

interface Props {
    title: string
    artist: string
    music: string
    albumArt: string
    closedWidth: number
    closedHeight: number
    openWidth: number
    openHeight: number
    radius: number
    backgroundColor: string
    foregroundColor: string
    mutedColor: string
    accentColor: string
    progressBackground: string
    progressColor: string
    shadow: boolean
    shadowOpacity: number
    hoverEnabled: boolean
    animationSpeed: number
    previewOpen: boolean
    style?: React.CSSProperties
}

function PlayIcon({ color }: { color: string }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path d="M8.5 5.8L18.5 12L8.5 18.2V5.8Z" fill={color} />
        </svg>
    )
}

function PauseIcon({ color }: { color: string }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <rect x="7" y="5" width="3.5" height="14" rx="1.5" fill={color} />
            <rect
                x="13.5"
                y="5"
                width="3.5"
                height="14"
                rx="1.5"
                fill={color}
            />
        </svg>
    )
}

function RestartIcon({ color }: { color: string }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M7.5 8.5A6.5 6.5 0 1 1 7 15"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M7.5 5.5V9.5H11.5"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function StopIcon({ color }: { color: string }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <rect x="6" y="6" width="12" height="12" rx="2" fill={color} />
        </svg>
    )
}

function VolumeIcon({ color, muted }: { color: string; muted: boolean }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path d="M4 9V15H8L13 19V5L8 9H4Z" fill={color} />

            {muted ? (
                <>
                    <path
                        d="M16 9L21 15"
                        stroke={color}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M21 9L16 15"
                        stroke={color}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </>
            ) : (
                <>
                    <path
                        d="M16 8.5C17.1 9.45 17.8 10.65 17.8 12C17.8 13.35 17.1 14.55 16 15.5"
                        stroke={color}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                    <path
                        d="M18.8 6.2C20.35 7.7 21.2 9.7 21.2 12C21.2 14.3 20.35 16.3 18.8 17.8"
                        stroke={color}
                        strokeWidth="1.7"
                        strokeLinecap="round"
                    />
                </>
            )}
        </svg>
    )
}

function Equalizer({
    color,
    active,
    reducedMotion,
}: {
    color: string
    active: boolean
    reducedMotion: boolean
}) {
    const bars = [6, 10, 7, 11]

    return (
        <div
            aria-hidden="true"
            style={{
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexShrink: 0,
            }}
        >
            {bars.map((height, index) => (
                <motion.div
                    key={index}
                    animate={
                        active && !reducedMotion
                            ? {
                                  height: [
                                      height * 0.35,
                                      height,
                                      height * 0.55,
                                      height * 0.9,
                                      height * 0.35,
                                  ],
                              }
                            : {
                                  height: active ? height * 0.7 : height * 0.4,
                              }
                    }
                    transition={
                        active && !reducedMotion
                            ? {
                                  duration: 0.62 + index * 0.08,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  ease: "easeInOut",
                                  delay: index * 0.07,
                              }
                            : {
                                  duration: 0.12,
                              }
                    }
                    style={{
                        width: 2.5,
                        minHeight: 2,
                        borderRadius: 999,
                        background: color,
                        flexShrink: 0,
                    }}
                />
            ))}
        </div>
    )
}

function formatTime(value: number) {
    if (!Number.isFinite(value) || value < 0) {
        return "0:00"
    }

    const totalSeconds = Math.floor(value)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export default function KarimSaifHoverExpandPlayer({
    title,
    artist,
    music,
    albumArt,
    closedWidth,
    closedHeight,
    openWidth,
    openHeight,
    radius,
    backgroundColor,
    foregroundColor,
    mutedColor,
    accentColor,
    progressBackground,
    progressColor,
    shadow,
    shadowOpacity,
    hoverEnabled,
    animationSpeed,
    previewOpen,
    style,
}: Props) {
    const isStatic = useIsStaticRenderer()
    const reducedMotion = useReducedMotion()

    const audioRef = React.useRef<HTMLAudioElement | null>(null)

    const [hovered, setHovered] = React.useState(false)
    const [playing, setPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [volume, setVolume] = React.useState(1)
    const [audioError, setAudioError] = React.useState(false)

    const safeClosedWidth = Math.max(120, closedWidth)
    const safeClosedHeight = Math.max(40, closedHeight)

    const safeOpenWidth = Math.max(safeClosedWidth, openWidth)

    const safeOpenHeight = Math.max(safeClosedHeight, openHeight)

    const safeRadius = Math.max(0, radius)

    const safeShadowOpacity = Math.min(0.8, Math.max(0, shadowOpacity))

    const safeAnimationSpeed = Math.min(3, Math.max(0.25, animationSpeed))

    const open = isStatic ? previewOpen : hoverEnabled && hovered

    const shouldAnimate = !isStatic && !reducedMotion

    const closedArtworkTop = Math.max(0, (safeClosedHeight - 40) / 2)

    const closedContentTop = Math.max(0, (safeClosedHeight - 40) / 2)

    const expansionTransition = shouldAnimate
        ? {
              type: "spring" as const,
              stiffness: 330,
              damping: 30,
              mass: Math.max(0.3, 1 / safeAnimationSpeed),
          }
        : {
              duration: 0,
          }

    React.useEffect(() => {
        if (isStatic) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.volume = volume
    }, [volume, isStatic])

    React.useEffect(() => {
        if (isStatic) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        if (!music) {
            audio.pause()
            audio.removeAttribute("src")
            audio.load()

            setPlaying(false)
            setCurrentTime(0)
            setDuration(0)
            setAudioError(false)

            return
        }

        audio.pause()
        audio.removeAttribute("src")
        audio.load()

        audio.src = music
        audio.preload = "metadata"
        audio.load()

        setPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        setAudioError(false)
    }, [music, isStatic])

    React.useEffect(() => {
        if (isStatic) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        const handleLoadedMetadata = () => {
            const nextDuration = Number.isFinite(audio.duration)
                ? audio.duration
                : 0

            setDuration(nextDuration)
            setAudioError(false)
        }

        const handleDurationChange = () => {
            const nextDuration = Number.isFinite(audio.duration)
                ? audio.duration
                : 0

            setDuration(nextDuration)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handlePlay = () => {
            setPlaying(true)
        }

        const handlePause = () => {
            setPlaying(false)
        }

        const handleEnded = () => {
            setPlaying(false)
            setCurrentTime(Number.isFinite(audio.duration) ? audio.duration : 0)
        }

        const handleError = () => {
            setPlaying(false)
            setAudioError(true)
        }

        audio.addEventListener("loadedmetadata", handleLoadedMetadata)

        audio.addEventListener("durationchange", handleDurationChange)

        audio.addEventListener("timeupdate", handleTimeUpdate)

        audio.addEventListener("play", handlePlay)

        audio.addEventListener("pause", handlePause)

        audio.addEventListener("ended", handleEnded)

        audio.addEventListener("error", handleError)

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata)

            audio.removeEventListener("durationchange", handleDurationChange)

            audio.removeEventListener("timeupdate", handleTimeUpdate)

            audio.removeEventListener("play", handlePlay)

            audio.removeEventListener("pause", handlePause)

            audio.removeEventListener("ended", handleEnded)

            audio.removeEventListener("error", handleError)
        }
    }, [isStatic])

    React.useEffect(() => {
        return () => {
            const audio = audioRef.current

            if (audio) {
                audio.pause()
                audio.removeAttribute("src")
                audio.load()
            }
        }
    }, [])

    const togglePlay = React.useCallback(() => {
        if (isStatic || !music || audioError) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        if (audio.paused) {
            const promise = audio.play()

            if (promise) {
                promise.catch(() => {
                    setPlaying(false)
                    setAudioError(true)
                })
            }
        } else {
            audio.pause()
        }
    }, [audioError, isStatic, music])

    const restartTrack = React.useCallback(() => {
        if (isStatic || !music) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.currentTime = 0
        setCurrentTime(0)

        if (!audio.paused) {
            const promise = audio.play()

            if (promise) {
                promise.catch(() => {
                    setPlaying(false)
                    setAudioError(true)
                })
            }
        }
    }, [isStatic, music])

    const stopTrack = React.useCallback(() => {
        if (isStatic || !music) {
            return
        }

        const audio = audioRef.current

        if (!audio) {
            return
        }

        audio.pause()
        audio.currentTime = 0

        setCurrentTime(0)
        setPlaying(false)
    }, [isStatic, music])

    const seekTo = React.useCallback(
        (clientX: number, element: HTMLElement) => {
            if (isStatic || duration <= 0) {
                return
            }

            const audio = audioRef.current

            if (!audio) {
                return
            }

            const rect = element.getBoundingClientRect()

            if (rect.width <= 0) {
                return
            }

            const position = Math.min(
                1,
                Math.max(0, (clientX - rect.left) / rect.width)
            )

            const nextTime = position * duration

            audio.currentTime = nextTime
            setCurrentTime(nextTime)
        },
        [duration, isStatic]
    )

    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
        seekTo(event.clientX, event.currentTarget)
    }

    const handleProgressKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (isStatic || duration <= 0) {
            return
        }

        let nextTime = currentTime

        switch (event.key) {
            case "ArrowRight":
                nextTime = Math.min(duration, currentTime + 5)
                break

            case "ArrowLeft":
                nextTime = Math.max(0, currentTime - 5)
                break

            case "Home":
                nextTime = 0
                break

            case "End":
                nextTime = duration
                break

            default:
                return
        }

        event.preventDefault()

        if (audioRef.current) {
            audioRef.current.currentTime = nextTime
        }

        setCurrentTime(nextTime)
    }

    const progress =
        duration > 0
            ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
            : 0

    const volumeMuted = volume <= 0.001

    return (
        <div
            style={{
                ...style,
                width: "100%",
                height: "100%",
                minWidth: 1,
                minHeight: 1,
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                overflow: "visible",
                pointerEvents: "auto",
            }}
            onMouseEnter={() => {
                if (!isStatic && hoverEnabled) {
                    setHovered(true)
                }
            }}
            onMouseLeave={() => {
                if (!isStatic) {
                    setHovered(false)
                }
            }}
        >
            {!isStatic && (
                <audio
                    ref={audioRef}
                    preload="metadata"
                    style={{
                        display: "none",
                    }}
                />
            )}

            <motion.div
                initial={false}
                animate={{
                    width: open ? safeOpenWidth : safeClosedWidth,
                    height: open ? safeOpenHeight : safeClosedHeight,
                    borderRadius: safeRadius,
                }}
                transition={expansionTransition}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: safeClosedWidth,
                    height: safeClosedHeight,
                    flexShrink: 0,
                    overflow: "hidden",
                    background: backgroundColor,
                    color: foregroundColor,
                    boxSizing: "border-box",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: shadow
                        ? `0 18px 45px rgba(0,0,0,${safeShadowOpacity})`
                        : "none",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, Arial, sans-serif',
                    userSelect: "none",
                }}
            >
                <motion.img
                    src={albumArt || ""}
                    alt=""
                    initial={false}
                    animate={{
                        width: open ? 76 : 40,
                        height: open ? 76 : 40,
                        left: open ? 16 : 10,
                        top: open ? 16 : closedArtworkTop,
                        borderRadius: open ? 18 : 12,
                    }}
                    transition={
                        shouldAnimate
                            ? {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 28,
                              }
                            : {
                                  duration: 0,
                              }
                    }
                    style={{
                        position: "absolute",
                        objectFit: "cover",
                        display: "block",
                        background: "#202020",
                    }}
                />

                <motion.div
                    initial={false}
                    animate={{
                        opacity: open ? 0 : 1,
                        x: open ? -8 : 0,
                    }}
                    transition={{
                        duration: shouldAnimate ? 0.16 : 0,
                    }}
                    style={{
                        position: "absolute",
                        left: 60,
                        right: 12,
                        top: closedContentTop,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        pointerEvents: open ? "none" : "auto",
                    }}
                >
                    <div
                        style={{
                            minWidth: 0,
                            flex: 1,
                            height: 40,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 3,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
                                lineHeight: "14px",
                                fontWeight: 650,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {title}
                        </div>

                        <div
                            style={{
                                fontSize: 10,
                                lineHeight: "11px",
                                color: mutedColor,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {artist}
                        </div>
                    </div>

                    <div
                        style={{
                            width: 16,
                            height: 16,
                            marginLeft: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <Equalizer
                            color={accentColor}
                            active={playing}
                            reducedMotion={!!reducedMotion}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        opacity: open ? 1 : 0,
                        y: open ? 0 : 10,
                    }}
                    transition={{
                        duration: shouldAnimate ? 0.2 : 0,
                    }}
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: open ? "auto" : "none",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 108,
                            right: 16,
                            top: 18,
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 15,
                                lineHeight: "17px",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {title}
                        </div>

                        <div
                            style={{
                                marginTop: 5,
                                fontSize: 11,
                                lineHeight: "12px",
                                color: mutedColor,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {artist}
                        </div>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            left: 16,
                            right: 16,
                            bottom: 72,
                        }}
                    >
                        <div
                            role="slider"
                            tabIndex={isStatic ? -1 : 0}
                            aria-label="Playback progress"
                            aria-valuemin={0}
                            aria-valuemax={duration || 0}
                            aria-valuenow={currentTime}
                            onClick={handleProgressClick}
                            onKeyDown={handleProgressKeyDown}
                            style={{
                                height: 5,
                                width: "100%",
                                borderRadius: 999,
                                overflow: "hidden",
                                background: progressBackground,
                                cursor:
                                    isStatic || duration <= 0
                                        ? "default"
                                        : "pointer",
                                outline: "none",
                            }}
                        >
                            <motion.div
                                animate={{
                                    width: `${progress}%`,
                                }}
                                transition={{
                                    duration: shouldAnimate ? 0.15 : 0,
                                }}
                                style={{
                                    height: "100%",
                                    borderRadius: 999,
                                    background: progressColor,
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: 7,
                                fontSize: 9,
                                lineHeight: "10px",
                                color: mutedColor,
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            <span>{formatTime(currentTime)}</span>

                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {audioError && (
                        <div
                            style={{
                                position: "absolute",
                                left: 16,
                                right: 16,
                                bottom: 57,
                                textAlign: "center",
                                fontSize: 9,
                                lineHeight: "10px",
                                color: mutedColor,
                                pointerEvents: "none",
                            }}
                        >
                            Unable to load audio
                        </div>
                    )}

                    <div
                        style={{
                            position: "absolute",
                            left: 16,
                            right: 16,
                            bottom: 18,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 14,
                        }}
                    >
                        <button
                            type="button"
                            aria-label="Restart track"
                            disabled={isStatic || !music}
                            onClick={restartTrack}
                            style={{
                                width: 30,
                                height: 30,
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor:
                                    isStatic || !music ? "default" : "pointer",
                                opacity: isStatic || !music ? 0.4 : 1,
                            }}
                        >
                            <RestartIcon color={foregroundColor} />
                        </button>

                        <button
                            type="button"
                            aria-label={playing ? "Pause" : "Play"}
                            disabled={isStatic || !music}
                            onClick={togglePlay}
                            style={{
                                width: 36,
                                height: 36,
                                padding: 0,
                                border: 0,
                                borderRadius: 999,
                                background: accentColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor:
                                    isStatic || !music ? "default" : "pointer",
                                opacity: isStatic || !music ? 0.45 : 1,
                            }}
                        >
                            {playing ? (
                                <PauseIcon color={backgroundColor} />
                            ) : (
                                <PlayIcon color={backgroundColor} />
                            )}
                        </button>

                        <button
                            type="button"
                            aria-label="Stop track"
                            disabled={isStatic || !music}
                            onClick={stopTrack}
                            style={{
                                width: 30,
                                height: 30,
                                padding: 0,
                                border: 0,
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor:
                                    isStatic || !music ? "default" : "pointer",
                                opacity: isStatic || !music ? 0.4 : 1,
                            }}
                        >
                            <StopIcon color={foregroundColor} />
                        </button>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: 62,
                                height: 22,
                                flexShrink: 0,
                            }}
                        >
                            <VolumeIcon
                                color={mutedColor}
                                muted={volumeMuted}
                            />

                            <input
                                aria-label="Volume"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                disabled={isStatic}
                                onChange={(event) => {
                                    setVolume(Number(event.target.value))
                                }}
                                style={{
                                    width: 40,
                                    marginLeft: 5,
                                    padding: 0,
                                    accentColor: accentColor,
                                    cursor: isStatic ? "default" : "pointer",
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

KarimSaifHoverExpandPlayer.defaultProps = {
    title: "Fluid Motion",
    artist: "Karim Saif",
    music: "",
    albumArt:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    closedWidth: 230,
    closedHeight: 60,
    openWidth: 340,
    openHeight: 200,
    radius: 30,
    backgroundColor: "#0A0A0A",
    foregroundColor: "#FFFFFF",
    mutedColor: "rgba(255,255,255,0.48)",
    accentColor: "#FFFFFF",
    progressBackground: "rgba(255,255,255,0.12)",
    progressColor: "#FFFFFF",
    shadow: true,
    shadowOpacity: 0.28,
    hoverEnabled: true,
    animationSpeed: 1,
    previewOpen: true,
}

addPropertyControls(KarimSaifHoverExpandPlayer, {
    title: {
        type: ControlType.String,
        title: "Title",
        description: "Track title shown in the player.",
    },

    artist: {
        type: ControlType.String,
        title: "Artist",
        description: "Artist name shown below the track title.",
    },

    music: {
        type: ControlType.File,
        title: "Music",
        description: "Upload the audio file played by the component.",
        allowedFileTypes: ["mp3", "wav", "ogg", "m4a", "aac"],
    },

    albumArt: {
        type: ControlType.Image,
        title: "Album Art",
        description: "Artwork displayed beside the track information.",
    },

    closedWidth: {
        type: ControlType.Number,
        title: "Closed Width",
        description: "Width of the compact player before hover expansion.",
        min: 120,
        max: 600,
        step: 1,
        unit: "px",
    },

    closedHeight: {
        type: ControlType.Number,
        title: "Closed Height",
        description: "Height of the compact player before hover expansion.",
        min: 40,
        max: 160,
        step: 1,
        unit: "px",
    },

    openWidth: {
        type: ControlType.Number,
        title: "Open Width",
        description: "Width of the player after hover expansion.",
        min: 180,
        max: 800,
        step: 1,
        unit: "px",
    },

    openHeight: {
        type: ControlType.Number,
        title: "Open Height",
        description: "Height of the player after hover expansion.",
        min: 120,
        max: 500,
        step: 1,
        unit: "px",
    },

    radius: {
        type: ControlType.Number,
        title: "Radius",
        description: "Corner radius applied to the player.",
        min: 0,
        max: 100,
        step: 1,
        unit: "px",
    },

    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        description: "Background color of the player.",
    },

    foregroundColor: {
        type: ControlType.Color,
        title: "Text",
        description: "Primary text and control color.",
    },

    mutedColor: {
        type: ControlType.Color,
        title: "Muted",
        description: "Secondary text, artist, and time color.",
    },

    accentColor: {
        type: ControlType.Color,
        title: "Accent",
        description: "Color used for the play button and equalizer.",
    },

    progressBackground: {
        type: ControlType.Color,
        title: "Progress Track",
        description: "Background color behind the playback progress.",
    },

    progressColor: {
        type: ControlType.Color,
        title: "Progress Fill",
        description: "Color of the active playback progress.",
    },

    shadow: {
        type: ControlType.Boolean,
        title: "Shadow",
        description: "Adds a soft shadow around the player.",
        enabledTitle: "On",
        disabledTitle: "Off",
    },

    shadowOpacity: {
        type: ControlType.Number,
        title: "Shadow Opacity",
        description: "Controls the opacity of the player shadow.",
        min: 0,
        max: 0.8,
        step: 0.01,
    },

    hoverEnabled: {
        type: ControlType.Boolean,
        title: "Hover Expand",
        description: "Expands the player when the pointer enters it.",
        enabledTitle: "On",
        disabledTitle: "Off",
    },

    animationSpeed: {
        type: ControlType.Number,
        title: "Animation Speed",
        description:
            "Controls how quickly the player responds during expansion and collapse.",
        min: 0.25,
        max: 3,
        step: 0.05,
        unit: "x",
    },

    previewOpen: {
        type: ControlType.Boolean,
        title: "Preview Open",
        description: "Made with 💛 by [@karimsaif](https://x.com/karimsaif0)",
        enabledTitle: "Open",
        disabledTitle: "Closed",
    },
})
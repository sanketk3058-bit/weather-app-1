import { useEffect, useState } from 'react'

export function useAnimatedNumber(
    targetValue: number,
    duration: number = 800,
    startValue: number = 0
): number {
    const [displayValue, setDisplayValue] = useState(startValue)

    useEffect(() => {
        let startTime: number | null = null
        let animationFrameId: number
        const start = displayValue
        const end = targetValue
        const change = end - start

        if (change === 0) return

        const easeOutQuart = (t: number): number => {
            return 1 - Math.pow(1 - t, 4)
        }

        // Cubic-bezier(0.25, 0.46, 0.45, 0.94) approximation
        // This is close to easeOutQuad or easeOutCubic, but let's use a custom function if needed.
        // For simplicity and smoothness, easeOutQuart is very premium feeling.
        const easing = easeOutQuart

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percent = Math.min(progress / duration, 1)

            const easedPercent = easing(percent)
            const currentValue = start + change * easedPercent

            setDisplayValue(currentValue)

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setDisplayValue(end)
            }
        }

        animationFrameId = requestAnimationFrame(animate)

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetValue, duration]) // Removed displayValue from dependency to avoid restarting on every frame

    return displayValue
}

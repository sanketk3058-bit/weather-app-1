// Import React hooks for side effects and state management
import { useEffect, useState } from 'react'

/**
 * Custom hook to animate a number from a start value to a target value over a specified duration.
 * Uses requestAnimationFrame for smooth, high-performance animations.
 * 
 * @param targetValue - The final value to animate to.
 * @param duration - The duration of the animation in milliseconds. Defaults to 800ms.
 * @param startValue - The initial value to start animating from. Defaults to 0.
 * @returns The current animated value.
 */
export function useAnimatedNumber(
    targetValue: number,
    duration: number = 800,
    startValue: number = 0
): number {
    // State to hold the current display value during the animation
    const [displayValue, setDisplayValue] = useState(startValue)

    // Effect to handle the animation logic when targetValue or duration changes
    useEffect(() => {
        // Variable to store the start time of the animation
        let startTime: number | null = null
        // ID for the requestAnimationFrame to allow cancellation
        let animationFrameId: number
        
        // Capture the starting value (current display value)
        const start = displayValue
        // Capture the target end value
        const end = targetValue
        // Calculate the total change required
        const change = end - start

        // If there is no change needed, return early to avoid unnecessary processing
        if (change === 0) return

        /**
         * Easing function: Ease Out Quart.
         * Starts fast and decelerates slowly to the end.
         * Formula: 1 - (1 - t)^4
         * 
         * @param t - The progress ratio (0 to 1)
         * @returns The eased progress ratio
         */
        const easeOutQuart = (t: number): number => {
            return 1 - Math.pow(1 - t, 4)
        }

        // Assign the easing function.
        // Cubic-bezier(0.25, 0.46, 0.45, 0.94) approximation.
        // This provides a "premium" feel with a smooth landing.
        const easing = easeOutQuart

        /**
         * Animation loop function called by requestAnimationFrame.
         * 
         * @param timestamp - The current time provided by the browser
         */
        const animate = (timestamp: number) => {
            // Initialize startTime on the first frame
            if (!startTime) startTime = timestamp
            
            // Calculate elapsed time since animation started
            const progress = timestamp - startTime
            
            // Calculate the percentage of completion (0 to 1), clamped at 1
            const percent = Math.min(progress / duration, 1)

            // Apply the easing function to the percentage
            const easedPercent = easing(percent)
            
            // Calculate the current value based on the eased percentage
            const currentValue = start + change * easedPercent

            // Update the state with the new value
            setDisplayValue(currentValue)

            // Continue the animation if the duration has not been reached
            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                // Ensure the final value is exactly the target value
                setDisplayValue(end)
            }
        }

        // Start the animation loop
        animationFrameId = requestAnimationFrame(animate)

        // Cleanup function to cancel the animation frame if the component unmounts
        // or if the dependencies change (starting a new animation)
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetValue, duration]) // Dependency array: re-run only when target or duration changes. 
    // displayValue is intentionally omitted to prevent restarting the animation on every frame update.

    // Return the current animated value to be rendered
    return displayValue
}

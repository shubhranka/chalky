import { useMutation } from "convex/react"
import { useState } from "react"

export const useApiMutation = (mutateFunc: any) => {
    const [pending,setPending] = useState(false)
    const apiMutation = useMutation(mutateFunc)

    const mutate = async (args: any) => {
        setPending(true)
        try {
            await apiMutation(args)
        } catch (error) {
            console.error(error)
        }
        setPending(false)
    }

    return {
        mutate,
        pending
    }
}
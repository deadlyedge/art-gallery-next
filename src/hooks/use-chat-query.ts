import { useInfiniteQuery } from "@tanstack/react-query"
import qs from "query-string"

type ChatQueryProps = {
	queryKey: string
	apiUrl: string
	paramKey: "contentId" | "conversationId"
	paramValue: string
	refetchIntervalSeconds: number
}

export const useChatQuery = ({
	queryKey,
	apiUrl,
	paramKey,
	paramValue,
	refetchIntervalSeconds,
}: ChatQueryProps) => {
	// const { isConnected } = useSocket()

	const fetchMessages = async ({ pageParam = null }) => {
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					cursor: pageParam,
					[paramKey]: paramValue,
				},
			},
			{ skipNull: true },
		)
		const res = await fetch(url)
		return res.json()
	}

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery({
			queryKey: [queryKey],
			queryFn: fetchMessages,
			initialPageParam: null,
			getNextPageParam: (lastPage) => lastPage?.nextCursor,
			refetchInterval: refetchIntervalSeconds * 1000,
		})

	return {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	}
}

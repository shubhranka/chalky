import OrgSidebar from '@/app/(dashboard)/_components/OrgSidebar'
import { auth } from '@clerk/nextjs'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
    boards: defineTable({
        title: v.string(),
        orgId: v.string(),
        authorId: v.string(),
        authorName: v.string(),
        imageUrl: v.string(),
    })
        .index('byOrgId', ['orgId'])
        .searchIndex('search_title', {
            searchField: 'title',
            filterFields: ['orgId'],
        }),
    favouriteBoards: defineTable({
        boardId: v.id('boards'),
        userId: v.string(),
        orgId: v.string(),
    })
        .index('byBoard', ['boardId'])
        .index('byUserOrg', ['userId', 'orgId'])
        .index('byUserBoard', ['userId', 'boardId'])
        .index('byUserOrgBoard', ['userId', 'orgId', 'boardId'])
        .index('byUserBoardOrg', ['userId', 'boardId', 'orgId'])
})


import { getProfileByUsername, isFollowing, getUserPosts, getUserLikedPosts } from '@/app/src/actions/profile.action'
import { notFound } from 'next/navigation'
import React from 'react'
import ProfilePageClient from './profilePageClient'

export async function generateMetadata({params}: {params: {username: string}}){
   const user = await getProfileByUsername(params.username)
   if(!user) return

   return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`
   }
}

async function ProfilePageServer({ params }: {params: { username: string}}) {
  const user = await getProfileByUsername(params.username)

  if(!user) notFound()

    const [posts, likedPost, isCurrentUserFollowing] = await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id)
    ]) 

    return(
      <ProfilePageClient 
        user={user}
        posts={posts}
        likedPosts={likedPost}
        isFollowing={isCurrentUserFollowing}
      />
    )
}

export default ProfilePageServer

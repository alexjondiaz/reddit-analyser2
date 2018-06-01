import { get } from 'axios'

const metadata = async user => {
  try {
    const [
      about,
      comments,
      submissions,
      newComment,
      topComment,
      topSubmission,
    ] = await Promise.all([
      get(`https://www.reddit.com/user/${user}/about.json`),
      get(
        `https://api.pushshift.io/reddit/search/comment/?author=${user}&metadata=true&size=0`
      ),
      get(
        `https://api.pushshift.io/reddit/search/submission/?author=${user}&metadata=true&size=0`
      ),
      get(
        `https://api.pushshift.io/reddit/search/comment/?author=${user}&sort_type=created_utc&size=1`
      ),
      get(
        `https://api.pushshift.io/reddit/search/comment/?author=${user}&sort_type=score&size=1`
      ),
      get(
        `https://api.pushshift.io/reddit/search/submission/?author=${user}&sort_type=score&size=1`
      ),
    ])

    return {
      name: about.data.data.name,
      created: about.data.data.created,
      comments: comments.data.metadata.total_results,
      comment: {
        new: {
          body: newComment.data.data[0].body,
          karma: newComment.data.data[0].score,
          created: newComment.data.data[0].created_utc,
        },
        top: {
          body: topComment.data.data[0].body,
          karma: topComment.data.data[0].score,
          created: topComment.data.data[0].created_utc,
        },
      },
      submissions: submissions.data.metadata.total_results,
      submission: {
        top: {
          title: topSubmission.data.data[0].title,
          comments: topSubmission.data.data[0].num_comments,
          karma: topSubmission.data.data[0].score,
          created: topSubmission.data.data[0].created_utc,
        },
      },
      karma: {
        link: about.data.data.link_karma,
        comment: about.data.data.comment_karma,
      },
    }
  } catch (error) {
    throw error
  }
}

export default { metadata }

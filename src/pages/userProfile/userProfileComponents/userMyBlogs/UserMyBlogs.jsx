import Card from "../../../../shared/ui/components/Card/Card";
import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import styles from "./UserMyBlogs.module.css";

export default function UserMyBlogs({ userProfile }) {
  if (!userProfile?.blogs?.length) {
    return (
      <EmptyState
        icon="📝"
        title="Пока нет статей"
        description="Пользователь еще не опубликовал ни одной статьи"
      />
    );
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <h2>Статьи ({userProfile.blogs.length})</h2>
        <div className="stripe"></div>
        <div className={styles.blogs_container}>
          {userProfile.blogs.map((blog) => (
            <Card
              key={blog.id}
              id={blog.id}
              title={blog.title}
              coverUrl={blog.coverUrl}
              userId={blog.userId}
              user={{
                id: blog.userId,
                fullName: blog.author || userProfile.fullName,
                logoFileName: blog.userLogoFileName || userProfile.logoFileName,
                subscription: blog.userSubscription || userProfile.subscription,
              }}
              category="blogs"
              description={blog.description}
              createdAt={blog.createdAt}
              updatedAt={blog.updatedAt}
              likes={blog.likes || 0}
              favorited={blog.favorited || 0}
              isLiked={blog.isLiked || false}
              isFavorited={blog.isFavorited || false}
              viewPath={`/blog/${blog.id}`}
              isOwner={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

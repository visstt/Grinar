import Card from "../../../../shared/ui/components/Card/Card";
import EmptyState from "../../../../shared/ui/components/emptyState/EmptyState";
import { useDeleteBlog } from "../../hooks/useDeleteBlog";
import { useEditBlog } from "../../hooks/useEditBlog";
import useMyProfile from "../../hooks/useMyProfile";
import styles from "./MyBlogs.module.css";

export default function MyBlogs() {
  const { profile, loading, error, removeBlog } = useMyProfile();
  const { deleteBlog, loading: deleteLoading } = useDeleteBlog();
  const { getBlogForEdit } = useEditBlog();

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
      const success = await deleteBlog(blogId);
      if (success) {
        removeBlog(blogId);
      }
    }
  };

  const handleEditBlog = async (blogId) => {
    // Очищаем предыдущие данные из localStorage
    localStorage.removeItem("editingBlog");

    const blogData = await getBlogForEdit(blogId);
    if (blogData) {
      // Передаем данные статьи в редактор через localStorage
      localStorage.setItem("editingBlog", JSON.stringify(blogData));
      // Переходим на страницу редактирования
      window.location.href = `/create-article?edit=${blogId}`;
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error)
    return (
      <div style={{ color: "red" }}>
        Ошибка: {typeof error === "string" ? error : error?.message || "Ошибка"}
      </div>
    );

  if (!profile?.blogs?.length) {
    return (
      <EmptyState
        icon="📝"
        title="Пока нет статей"
        description="Создайте свою первую статью и поделитесь знаниями с сообществом"
        actionText="Добавить статью"
        onAction={() => (window.location.href = "/create-article")}
      />
    );
  }

  return (
    <div className={styles.blogsContainer}>
      <div className={styles.card_wrapper}>
        {profile.blogs.map((blog) => (
          <div key={blog.id} className={styles.blogCard}>
            <Card
              blog={{
                id: blog.id,
                name: blog.name,
                coverImage: blog.coverImage,
                description: blog.description,
                author: {
                  ...blog.author,
                  specializations: blog.author?.specializations || [],
                },
                likes: blog.likes,
                views: blog.views,
                createdAt: blog.createdAt,
                category: blog.category || null,
              }}
              type="blog"
            />
            <div className={styles.actionButtons}>
              <button
                className={styles.editButton}
                onClick={() => handleEditBlog(blog.id)}
                title="Редактировать статью"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteBlog(blog.id)}
                disabled={deleteLoading}
                title="Удалить статью"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 5H4.16667H17.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15515 2.15482C7.46771 1.84226 7.89164 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.533 1.84226 12.8455 2.15482C13.1581 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.6581 17.5326 15.3455 17.8452C15.033 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39164 18.3333 4.96771 18.1577 4.65515 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.33301 9.16667V14.1667"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.667 9.16667V14.1667"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export const useBlogNavigation = () => {
  const navigate = useNavigate();

  const navigateToBlog = (blogId) => {
    navigate(`/blog/blog-by-id/${blogId}`);
  };

  return { navigateToBlog };
};

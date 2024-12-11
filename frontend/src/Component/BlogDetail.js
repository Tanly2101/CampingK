import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams(); // Lấy ID của blog hiện tại từ URL
  const [blog, setBlog] = useState(null); // Dữ liệu blog hiện tại
  const [images, setImages] = useState([]); // Hình ảnh của blog hiện tại
  const [relatedBlogs, setRelatedBlogs] = useState([]); // Các bài blog liên quan

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tất cả blog và hình ảnh từ API
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/datablogs`
        );
        const { blogs, blogImages } = response.data;

        // Tìm bài blog hiện tại bằng cách so khớp ID từ URL
        const currentBlog = blogs.find((blog) => blog.id === parseInt(id));
        setBlog(currentBlog);

        // Lọc ra các hình ảnh liên quan đến bài blog hiện tại
        const currentBlogImages = blogImages
          .filter((image) => image.blog_id === parseInt(id))
          .map((image) => image.secure_url);
        setImages(currentBlogImages);

        // Lấy các blog khác, ngoại trừ blog hiện tại (để làm blog liên quan)
        const otherBlogs = blogs.filter((blog) => blog.id !== parseInt(id));
        setRelatedBlogs(otherBlogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mx-auto mt-8 px-4 max-w-screen-xl">
        <div className="flex flex-wrap">
          {/* Nội dung bài viết - chiếm 70% */}
          <div className="w-full lg:w-8/12 pr-4">
            <div className="mb-6">
              {images.map((image, index) => (
                <div key={index} className="relative mb-8">
                  <img
                    src={image}
                    alt={blog.title}
                    className="w-full h-auto max-h-60 object-contain rounded-lg " // Adjusted the image class here
                  />
                  <h1 className="absolute bottom-0 text-justify left-1/2 transform -translate-x-1/2 translate-y-[20%] text-4xl font-bold text-gray-800 bg-white/90 px-4 py-2 rounded-lg">
                    {blog.title}
                  </h1>
                </div>
              ))}
            </div>
            <div className="text-lg text-gray-700 leading-relaxed max-w-[95%] mx-auto text-justify">
              <p
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
          {/* Danh sách blog liên quan - chiếm 30% */}
          <div className="w-full lg:w-4/12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Blogs Nổi Tiếng
            </h2>
            <ul className="space-y-4">
              {relatedBlogs.map((relatedBlog) => (
                <li
                  key={relatedBlog.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link to={`/blog/${relatedBlog.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">
                      {relatedBlog.title}
                    </h3>
                    {images[relatedBlog.id] && (
                      <img
                        src={images[relatedBlog.id][0]}
                        alt={relatedBlog.title}
                        className="w-full h-28 object-cover rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm text-gray-600">
                      {relatedBlog.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="h-64"></div>
    </>
  );
};

export default BlogDetail;

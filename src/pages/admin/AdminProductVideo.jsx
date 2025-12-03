import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiVideo, FiImage, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { videoApi } from '../../api/videoApi';
import { productApi } from '../../api/productApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';

const AdminProductVideo = () => {
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    productId: '',
    productName: '',
    price: '',
    category: 'featured',
    isActive: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    fetchVideos();
    fetchProducts();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoApi.getVideos({ limit: 100 });
      setVideos(response.videos || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts({ limit: 100 });
      setProducts(response || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        videoFile: videoFile
      };
      
      console.log('Submitting video data:', {
        ...formData,
        hasVideoFile: !!videoFile
      });
      
      if (editingVideo) {
        await videoApi.updateVideo(editingVideo._id, submitData);
      } else {
        await videoApi.createVideo(submitData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchVideos();
    } catch (error) {
      console.error('Failed to save video:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to save video: ' + (error.response?.data?.message || error.message) + '\n' + (error.response?.data?.error || ''));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoApi.deleteVideo(id);
        fetchVideos();
      } catch (error) {
        alert('Failed to delete video');
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      productId: video.productId?._id || '',
      productName: video.productName || '',
      price: video.price || '',
      category: video.category || 'featured',
      isActive: video.isActive !== undefined ? video.isActive : true
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      productId: '',
      productName: '',
      price: '',
      category: 'featured',
      isActive: true
    });
    setEditingVideo(null);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const toggleVideoStatus = async (video) => {
    try {
      await videoApi.updateVideo(video._id, { isActive: !video.isActive });
      fetchVideos();
    } catch (error) {
      alert('Failed to update video status');
    }
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const selectedProduct = products.find(p => p._id === productId);
    
    setFormData({
      ...formData,
      productId: productId,
      productName: selectedProduct?.title || '',
      price: selectedProduct?.price || ''
    });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size should be less than 50MB');
        return;
      }
      
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FiVideo className="text-[#02333a]" />
                  Product Videos
                </h1>
                <p className="text-gray-600 mt-2">Manage product showcase videos</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#02333a] text-white rounded-lg hover:bg-[#024450] transition-colors shadow-md"
              >
                <FiPlus size={20} />
                Add New Video
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{videos.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiVideo className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Videos</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {videos.filter(v => v.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiEye className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Inactive Videos</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {videos.filter(v => !v.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiEyeOff className="text-gray-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {new Set(videos.map(v => v.category)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiImage className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Videos List */}
          {isLoading ? (
            <Loader fullScreen={false} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Preview
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {videos.map((video) => (
                      <tr key={video._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-gray-100">
                            <video
                              src={video.video}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <FiVideo className="text-white" size={24} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {video.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {video.video}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{video.productName || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {video.price ? `₹${video.price.toFixed(2)}` : '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {video.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleVideoStatus(video)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                              video.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {video.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(video)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {videos.length === 0 && (
                <div className="text-center py-12">
                  <FiVideo className="mx-auto text-gray-400" size={48} />
                  <p className="text-gray-600 mt-4">No videos found</p>
                  <button
                    onClick={() => {
                      resetForm();
                      setIsModalOpen(true);
                    }}
                    className="mt-4 text-[#02333a] hover:underline"
                  >
                    Add your first video
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                  required
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File * (Instagram Format: 9:16)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                  required={!editingVideo}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload vertical video (9:16 aspect ratio). Max size: 50MB. Formats: MP4, WebM, MOV
                </p>
                {videoPreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <video
                      src={videoPreview}
                      controls
                      className="w-40 h-72 object-cover rounded-lg border border-gray-200"
                      style={{ aspectRatio: '9/16' }}
                    />
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Product (Optional)
                </label>
                <select
                  value={formData.productId}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                >
                  <option value="">-- No Product --</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title} - ₹{product.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Optional custom product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02333a] focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                  <option value="casual">Casual</option>
                  <option value="essential">Essential</option>
                  <option value="hijab">Hijab</option>
                  <option value="occasion">Occasion</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#02333a] rounded focus:ring-2 focus:ring-[#02333a]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#02333a] text-white rounded-lg hover:bg-[#024450] transition-colors"
                >
                  {editingVideo ? 'Update Video' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductVideo;

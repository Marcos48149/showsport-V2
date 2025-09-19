"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ui/image-upload";
import CloudinaryStatus from "@/components/CloudinaryStatus";
import { useBlog, type BlogPost, type BlogCategory } from "@/contexts/BlogContext";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Eye,
  Save,
  X,
  Upload,
  Calendar,
  Clock,
  Tag,
  Settings,
  BarChart3,
  Users,
  FileText,
  Image as ImageIcon,
  Globe,
  Mail,
  Shield,
  RefreshCw,
  Database
} from "lucide-react";

interface BlogCMSPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PostFormData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tags: string[];
  author: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  schemaType: 'Article' | 'FAQ' | 'HowTo' | 'Review';
}

export default function BlogCMSPanel({ isOpen, onClose }: BlogCMSPanelProps) {
  const {
    state,
    createPost,
    updatePost,
    deletePost,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshData
  } = useBlog();
  const [activeTab, setActiveTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: [],
    author: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
    schemaType: 'Article'
  });

  const tabs = [
    { id: 'posts', name: 'Posts', icon: FileText, count: state.posts.length },
    { id: 'categories', name: 'Categorías', icon: Tag, count: state.categories.length },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, count: 0 },
    { id: 'settings', name: 'Configuración', icon: Settings, count: 0 }
  ];

  const filteredPosts = state.posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewPost = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryId: state.categories[0]?.id || '',
      tags: [],
      author: '',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      isPublished: false,
      schemaType: 'Article'
    });
    setSelectedPost(null);
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      categoryId: post.category.id,
      tags: post.tags,
      author: post.author,
      featuredImage: post.featuredImage,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      isPublished: post.isPublished,
      schemaType: post.schemaType || 'Article'
    });
    setSelectedPost(post);
    setIsEditing(true);
  };

  const handleSavePost = async () => {
    try {
      setIsLoading(true);

      if (formData.id) {
        // Update existing post
        await updatePost(formData.id, formData);
      } else {
        // Create new post
        await createPost(formData);
      }

      setIsEditing(false);
      setSelectedPost(null);
      alert('Post guardado exitosamente');

      // Refresh data
      await refreshData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        setIsLoading(true);
        await deletePost(postId);
        alert('Post eliminado exitosamente');
        await refreshData();
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      metaTitle: title.length > 0 ? `${title} | ShowSport Blog` : ''
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen py-4 px-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Blog CMS</h2>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Estadísticas Rápidas</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts Publicados</span>
                    <span className="font-medium">{state.posts.filter(p => p.isPublished).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Borradores</span>
                    <span className="font-medium">{state.posts.filter(p => !p.isPublished).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categorías</span>
                    <span className="font-medium">{state.categories.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Posts Management */}
              {activeTab === 'posts' && (
                <div className="p-6">
                  {!isEditing ? (
                    <>
                      {/* Posts List Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Gestión de Posts</h3>
                          <p className="text-gray-600">Administra todos los artículos de tu blog</p>
                        </div>
                        <Button onClick={handleNewPost} className="bg-orange-500 hover:bg-orange-600">
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Post
                        </Button>
                      </div>

                      {/* Search and Filters */}
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <Button variant="outline">
                          <Filter className="h-4 w-4 mr-2" />
                          Filtros
                        </Button>
                      </div>

                      {/* Posts Table */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Post
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Autor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center">
                                      <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="h-10 w-16 object-cover rounded mr-4"
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                          {post.title}
                                        </div>
                                        <div className="text-sm text-gray-500 line-clamp-1">
                                          {post.excerpt}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ${post.category.color}`}>
                                      {post.category.name}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {post.author}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {post.isPublished ? 'Publicado' : 'Borrador'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(post.publishedAt).toLocaleDateString('es-AR')}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        onClick={() => window.open(`/blog/${post.category.slug}/${post.slug}`, '_blank')}
                                        variant="outline"
                                        size="sm"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        onClick={() => handleEditPost(post)}
                                        variant="outline"
                                        size="sm"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        onClick={() => handleDeletePost(post.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Post Editor */
                    <PostEditor
                      formData={formData}
                      setFormData={setFormData}
                      categories={state.categories}
                      onSave={handleSavePost}
                      onCancel={() => setIsEditing(false)}
                      handleTitleChange={handleTitleChange}
                    />
                  )}
                </div>
              )}

              {/* Categories Management */}
              {activeTab === 'categories' && (
                <CategoriesManager categories={state.categories} />
              )}

              {/* Analytics */}
              {activeTab === 'analytics' && (
                <AnalyticsPanel posts={state.posts} categories={state.categories} />
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <SettingsPanel />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Post Editor Component
function PostEditor({
  formData,
  setFormData,
  categories,
  onSave,
  onCancel,
  handleTitleChange
}: {
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  categories: BlogCategory[];
  onSave: () => void;
  onCancel: () => void;
  handleTitleChange: (title: string) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {formData.id ? 'Editar Post' : 'Nuevo Post'}
          </h3>
          <p className="text-gray-600">
            {formData.id ? 'Modifica el contenido de tu post' : 'Crea un nuevo artículo para tu blog'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título del artículo"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-del-articulo"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor *
              </label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Nombre del autor"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Schema
              </label>
              <select
                value={formData.schemaType}
                onChange={(e) => setFormData(prev => ({ ...prev, schemaType: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Article">Artículo</option>
                <option value="HowTo">Guía Paso a Paso</option>
                <option value="FAQ">Preguntas Frecuentes</option>
                <option value="Review">Review</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extracto *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Breve descripción del artículo"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Contenido</h4>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Contenido completo del artículo..."
            rows={12}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 En una implementación real, aquí estaría un editor WYSIWYG avanzado
          </p>
        </div>

        {/* SEO Settings */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Configuración SEO</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Título
              </label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="Título SEO para motores de búsqueda"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recomendado: 50-60 caracteres ({formData.metaTitle.length}/60)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Descripción
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Descripción para motores de búsqueda"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recomendado: 150-160 caracteres ({formData.metaDescription.length}/160)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Destacada
              </label>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                type="post"
                placeholder="Sube la imagen destacada del artículo"
              />
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Publicación</h4>
          <div className="flex items-center justify-between">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Publicar inmediatamente
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Si no está marcado, se guardará como borrador
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Preview URL:</p>
              <p className="text-xs text-blue-600">
                /blog/{categories.find(c => c.id === formData.categoryId)?.slug}/{formData.slug}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Categories Manager Component
function CategoriesManager({ categories }: { categories: BlogCategory[] }) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Categorías</h3>
        <p className="text-gray-600 mb-6">Administra las categorías de tu blog</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                  {category.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.postCount} posts</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>
    </div>
  );
}

// Analytics Panel Component
function AnalyticsPanel({ posts, categories }: { posts: BlogPost[], categories: BlogCategory[] }) {
  const publishedPosts = posts.filter(p => p.isPublished);
  const draftPosts = posts.filter(p => !p.isPublished);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Analytics del Blog</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Publicados</p>
              <p className="text-2xl font-bold text-green-600">{publishedPosts.length}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Borradores</p>
              <p className="text-2xl font-bold text-yellow-600">{draftPosts.length}</p>
            </div>
            <Edit2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <Tag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border rounded-lg">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Posts por Categoría</h4>
        <div className="space-y-3">
          {categories.map(category => {
            const categoryPosts = posts.filter(p => p.category.id === category.id);
            return (
              <div key={category.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-gray-600">{categoryPosts.length} posts</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Settings Panel Component
function SettingsPanel() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuración del Blog</h3>
        <p className="text-gray-600">Ajustes generales y configuración avanzada</p>
      </div>

      {/* Cloudinary Configuration */}
      <CloudinaryStatus />

      {/* Other Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            SEO General
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Configurar meta tags globales, sitemap y structured data
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Sitemap XML</span>
              <span className="text-green-600">✓ Activo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Structured Data</span>
              <span className="text-green-600">✓ Activo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Meta Tags</span>
              <span className="text-green-600">✓ Dinámicos</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Analytics
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Conectar Google Analytics y Search Console
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Google Analytics</span>
              <span className="text-yellow-600">⚠ Pendiente</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Search Console</span>
              <span className="text-yellow-600">⚠ Pendiente</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Event Tracking</span>
              <span className="text-green-600">✓ Preparado</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-500" />
            Newsletter
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Configurar suscripciones y automatizaciones
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Formulario Suscripción</span>
              <span className="text-green-600">✓ Activo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Email Provider</span>
              <span className="text-yellow-600">⚠ Demo</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Seguridad
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Configuración de seguridad y accesos
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>NextAuth.js</span>
              <span className="text-green-600">✓ Activo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Roles de Usuario</span>
              <span className="text-green-600">✓ Configurado</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>API Protection</span>
              <span className="text-green-600">✓ Activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Acciones Rápidas</h4>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerar Sitemap
          </Button>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Backup Base de Datos
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Exportar Posts
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Métricas
          </Button>
        </div>
      </div>
    </div>
  );
}

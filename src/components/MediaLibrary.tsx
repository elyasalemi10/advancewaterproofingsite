import { useState } from 'react'
import { Upload, Image, Video, X, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  altText: string
  caption: string
  tags: string[]
  uploadedAt: Date
}

export function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newItem: MediaItem = {
            id: Date.now().toString() + Math.random(),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: e.target?.result as string,
            title: file.name,
            altText: '',
            caption: '',
            tags: [],
            uploadedAt: new Date(),
          }
          setMediaItems((prev) => [...prev, newItem])
          toast.success(`${file.name} uploaded successfully!`)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error(`${file.name} is not a valid image or video file`)
      }
    })
  }

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
    toast.success('Media updated successfully!')
  }

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedItem(null)
    toast.success('Media deleted successfully!')
  }

  const addTag = (id: string, tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (!trimmedTag) return

    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id && !item.tags.includes(trimmedTag)
          ? { ...item, tags: [...item.tags, trimmedTag] }
          : item
      )
    )
  }

  const removeTag = (id: string, tag: string) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, tags: item.tags.filter((t) => t !== tag) }
          : item
      )
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Upload Area */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>
              Upload and manage images and videos for your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25'
              )}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Drag and drop files here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (images and videos)
              </p>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      <div className="lg:col-span-2">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-0">
                <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.altText || item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge className="absolute top-2 right-2">
                    {item.type === 'image' ? (
                      <Image className="h-3 w-3" />
                    ) : (
                      <Video className="h-3 w-3" />
                    )}
                  </Badge>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mediaItems.length === 0 && (
          <div className="text-center py-12">
            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No media uploaded yet</p>
          </div>
        )}
      </div>

      {/* Details Panel */}
      {selectedItem && (
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Media Details</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText || selectedItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedItem.title}
                onChange={(e) =>
                  updateMediaItem(selectedItem.id, { title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="altText">Alt Text (for SEO)</Label>
              <Input
                id="altText"
                value={selectedItem.altText}
                onChange={(e) =>
                  updateMediaItem(selectedItem.id, { altText: e.target.value })
                }
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={selectedItem.caption}
                onChange={(e) =>
                  updateMediaItem(selectedItem.id, { caption: e.target.value })
                }
                placeholder="Add a caption..."
                rows={3}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      onClick={() => removeTag(selectedItem.id, tag)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(selectedItem.id, e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>

            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(selectedItem.url)
                  toast.success('URL copied to clipboard!')
                }}
              >
                Copy URL
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => deleteMediaItem(selectedItem.id)}
              >
                Delete Media
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

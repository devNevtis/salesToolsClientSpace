//src/app/main/company/[companyId]/opportunities-config.jsx
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import useCompanyProducts from '@/store/useCompanyProducts';
import { useAuth } from "@/components/AuthProvider";
import axios from '@/lib/axios';
import { env } from '@/config/env';
import { Loader2 } from "lucide-react";
import { MdShoppingCart, MdEdit, MdDelete, MdAdd } from "react-icons/md";

export default function OpportunitiesConfig({ companyId }) {
    const { products, setProducts, addProduct, deleteProduct, updateProduct } = useCompanyProducts();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(env.endpoints.products.getAll);
        const companyProducts = response.data.filter(
          product => product.companyId === companyId
        );
        setProducts(companyProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Failed to load products. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [companyId, setProducts, toast]);

  const handleEditClick = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      description: product.description
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.description) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post(env.endpoints.products.create, {
        name: newProduct.name,
        description: newProduct.description,
        companyId,
      });

      addProduct(response.data);
      setNewProduct({ name: '', description: '' });
      setIsDialogOpen(false);
      
      toast({
        title: "Product created successfully",
        description: "The product has been added to your catalog.",
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error creating product",
        description: error.response?.data?.message || "Failed to create product.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingProduct.name || !editingProduct.description) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsEditing(true);
    try {
      const response = await axios.put(
        `${env.endpoints.products.update}/${editingProduct._id}`,
        {
          name: editingProduct.name,
          description: editingProduct.description,
          companyId
        }
      );

      updateProduct(response.data);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: error.response?.data?.message || "Failed to update product.",
      });
    } finally {
      setIsEditing(false);
    }
  };


  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${env.endpoints.products.delete}/${productToDelete._id}`);
      
      deleteProduct(productToDelete._id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      
      toast({
        title: "Product deleted",
        description: "The product has been removed from your catalog.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: error.response?.data?.message || "Failed to delete product.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Fixed Header */}
      <div className="bg-white pt-4 pb-2 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdShoppingCart className="text-2xl text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-700">Products</h2>
            <span className="text-sm text-gray-500 ml-2">
              Manage your product catalog
            </span>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
              >
                <MdAdd size={20} />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateProduct}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Product Name"
                value={editingProduct?.name || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  name: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Product Description"
                value={editingProduct?.description || ''}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  description: e.target.value
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSave}
              disabled={isEditing}
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Products List */}
      <div className="h-[72vh] overflow-y-auto pt-4">
        <Card className="shadow-md">
          <CardContent className="pt-4">
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products added yet
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border hover:border-gray-400 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(product)}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <MdEdit size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <MdDelete size={20} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
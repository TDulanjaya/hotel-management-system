import { useState, useEffect, useCallback } from "react";

export function useCrudPage<T extends { id: string }>(options: {
  fetchFn: () => Promise<T[]>;
  createFn: (data: any) => Promise<any>;
  updateFn: (id: string, data: any) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
  defaultFormData: Record<string, any>;
  deleteConfirmMessage?: string;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(options.defaultFormData);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await options.fetchFn();
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenNew = () => {
    setEditItem(null);
    setFormData({ ...options.defaultFormData });
    setPanelOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setEditItem(item);
    const mappedData = Object.keys(options.defaultFormData).reduce((acc, key) => {
      acc[key] = (item as any)[key] !== undefined && (item as any)[key] !== null 
        ? (item as any)[key] 
        : options.defaultFormData[key];
      return acc;
    }, {} as Record<string, any>);
    
    setFormData(mappedData);
    setPanelOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(options.deleteConfirmMessage || "Are you sure you want to delete this item?")) {
      try {
        await options.deleteFn(id);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to delete item");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await options.updateFn(editItem.id, formData);
      } else {
        await options.createFn(formData);
      }
      setPanelOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to save item");
    }
  };

  return {
    items,
    loading,
    error,
    panelOpen,
    editItem,
    formData,
    setFormData,
    handleOpenNew,
    handleOpenEdit,
    handleDelete,
    handleSubmit,
    setPanelOpen,
    refetch: fetchData,
  };
}

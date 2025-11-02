'use client';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ObjectId } from 'mongodb';

export function useAdminFetch<T = any>(
    key: string,
    url: string,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: [key],
        queryFn: async () => {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        ...options, // allows staleTime, retry, etc.
    });
}

interface ServicePayload {
    _id?: ObjectId;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export function useAdminMutations() {
    const qc = useQueryClient();

    const create = useMutation({
        mutationFn: async (payload: ServicePayload) => {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Create failed');
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
    });

    const update = useMutation({
        mutationFn: async (payload: ServicePayload) => {
            const res = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Update failed');
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
    });

    const remove = useMutation({
        mutationFn: async (_id: string) => {
            const res = await fetch('/api/services', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id }),
            });
            if (!res.ok) throw new Error('Delete failed');
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
    });

    return { create, update, remove };
}
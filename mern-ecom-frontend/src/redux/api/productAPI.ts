import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse, CategoriesResponse, DeleteProductRequest, MessageResponse, NewProductRequest, ProductRequest, SearchProductRequest, SearchProductResponse, UpdateProductRequest } from "../../types/api-types";


export const productAPI = createApi({
    reducerPath: "productApi", 
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`
    }),
    tagTypes: ["products"],
    endpoints: (builder) => ({

        latestProducts: builder.query<AllProductResponse, string>({ 
            query: () => "latest" ,
            providesTags: ["products"]
        }),
        allProducts: builder.query<AllProductResponse, string>({ 
            query: (id) => `admin-products?id=${id}`,
            providesTags: ["products"]
        }),
        categories: builder.query<CategoriesResponse, string>({ 
            query: () => `categories`,
            providesTags: ["products"]
        }),
        searchProducts: builder.query<SearchProductResponse, SearchProductRequest>({ 
            query: ({search, page, price,  category, sort}) => {
                let base = `all?search=${search}&page=${page}`;
                if (price) base += `&price=${price}`;
                if (category) base += `&category=${category}`;
                if (sort) base += `&sort=${sort}`;
                return base;
            },
            providesTags: ["products"]
        }),
        productDetails: builder.query<ProductRequest, string>({
            query: (id) => id,
            providesTags: ["products"] 
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({ 
            query: ({formData, id}) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["products"]
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({ 
            query: ({formData, userId, productId}) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["products"]
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({ 
            query: ({userId, productId}) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["products"]
        }),
    })
});

export const {
    useLatestProductsQuery,
    useAllProductsQuery,
    useCategoriesQuery,
    useSearchProductsQuery,
    useNewProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productAPI;
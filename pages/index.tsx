import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type {GetStaticPropsContext, InferGetStaticPropsType} from 'next'
import React from "react";
import {useProductsWithRecommendation} from "@lib/productRecommendations";

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }

  const productsPromise = commerce.getAllProducts({
    variables: { first: 12, sortKey: 'UPDATED_AT', reverse: true },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
      locale,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
  categories,
  brands
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const productsWithRecommendation = useProductsWithRecommendation(products);

  return (
    <>
      {/*Commented because of alternate homepage layout*/}
      {/*<Grid variant="filled">*/}
      {/*  {products.slice(0, 3).map((product: any, i: number) => (*/}
      {/*    <ProductCard*/}
      {/*      key={product.id}*/}
      {/*      product={product}*/}
      {/*      imgProps={{*/}
      {/*        width: i === 0 ? 1080 : 540,*/}
      {/*        height: i === 0 ? 1080 : 540,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</Grid>*/}
      {/*<Marquee variant="secondary">*/}
      {/*  {products.slice(0, 3).map((product: any, i: number) => (*/}
      {/*    <ProductCard key={product.id} product={product} variant="slim" />*/}
      {/*  ))}*/}
      {/*</Marquee>*/}
      {/*<Hero*/}
      {/*  headline=" Dessert dragée halvah croissant."*/}
      {/*  description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "*/}
      {/*/>*/}
      {/*<Grid layout="B" variant="filled">*/}
      {/*  {products.slice(0, 3).map((product: any, i: number) => (*/}
      {/*    <ProductCard*/}
      {/*      key={product.id}*/}
      {/*      product={product}*/}
      {/*      imgProps={{*/}
      {/*        width: i === 0 ? 1080 : 540,*/}
      {/*        height: i === 0 ? 1080 : 540,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</Grid>*/}
      {/*<Marquee>*/}
      {/*  {products.slice(3).map((product: any, i: number) => (*/}
      {/*    <ProductCard key={product.id} product={product} variant="slim" />*/}
      {/*  ))}*/}
      {/*</Marquee>*/}
      <HomeAllProductsGrid
        products={productsWithRecommendation}
        categories={categories}
        brands={brands}
      />
    </>
  )
}

Home.Layout = Layout

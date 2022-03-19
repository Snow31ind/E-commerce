import React from 'react';
import db from '../../utils/db';
import Product from '../../models/Product';
import Layout from '../../layouts/Layout';

export default function ProductScreen({ product }) {
  return <Layout title={product.name} description={`${product.name}`}></Layout>;
}

export async function getServerSideProps(context) {
  console.log(`Context - ${context}`);
  const { params } = context;
  console.log(`params - ${params}`);
  const { slug } = params;
  console.log(`slug - ${slug}`);

  await db.connect();
  const product = await Product.findOne({
    slug: slug,
  }).lean();
  await db.disconnect();

  console.log(product);

  return {
    props: {
      product: db.convertMongoDocToObject(product),
    },
  };
}

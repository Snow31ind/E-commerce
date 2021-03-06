import {
  Autocomplete,
  Box,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination as MuiPagination,
  TextField,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  ListItemIcon,
  PaginationItem,
} from '@mui/material';
import Layout from '../layouts/Layout';
import { arrayOfRange, capitalize } from '../utils/helpers';
import db from '../utils/db';
import Product from '../models/Product';
import { useContext, useEffect, useRef, useState } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import ProductCard from '../components/ProductCard/ProductCard';
import { useStyles } from '../utils/styles';
import ButtonComponentTag from '../components/ButtonComponentTag';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import StyledSlider from '../components/StyledSlider';
import dynamic from 'next/dynamic';
import FilterChip from '../components/FilterChip/FilterChip';
import SelectByFilter from '../components/SelectByFilter/SelectByFilter';
import {
  ADD_NEW_ITEM,
  ADD_TO_CART,
  ADD_TO_FAV,
  UPDATE_ITEM_QUANTITY,
} from '../constants/actionTypes';
import Pagination from '../components/Pagination/Pagination';
import { ProductionQuantityLimits, Sort } from '@mui/icons-material';

const PAGE_SIZE = 14;
const BREAK_ITEM_INDEX = 11;
const MINIMUM_PRICE_BOUNDARY = 10000000;
const MAXIMUM_PRICE_BOUNDARY = 40000000;
const PRICE_STEP = 5000000;
const PRICE_BOUNDARY = [MINIMUM_PRICE_BOUNDARY, MAXIMUM_PRICE_BOUNDARY];

const BRAND = 'Brand';
const CPU = 'CPU';
const RAM = 'RAM';
const GPU = 'GPU';
const SCREEN_SIZE = 'Screen Size';
const WEIGHT = 'Weight';
const PAGE = 'Page';
const PRICE = 'Price';
const SORT = 'Sort';

const orderFilters = [
  {
    value: 'featured',
    label: 'Featured',
  },
  {
    value: 'lowest',
    label: 'Low to high',
  },
  {
    value: 'highest',
    label: 'High to low',
  },

  {
    value: 'newest',
    label: 'Newest',
  },
];

function Home({
  products,
  pages,
  countProducts,
  brandPath,
  ramPath,
  cpuPath,
  gpuPath,
  screenSizePath,
  weightPath,
  isAtHomePage,
  scrollToFilterView,

  uniqueBrands,
  uniqueCPUs,
  uniqueGPUs,
  uniqueRAMs,
  uniqueScreenSizes,
  uniqueWeights,
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const {
    state: { favs },
    dispatch,
    cartState: { cart },
    cartDispatch,
  } = useContext(Store);

  const { query = 'all', sort = 'featured' } = router.query;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const filterRef = useRef();

  const [filterByList, setFilterByList] = useState([
    {
      category: BRAND,
      isFiltered: false,
      filteredList: brandPath || [],
      categorizedList: uniqueBrands || [],
    },
    {
      category: CPU,
      isFiltered: false,
      filteredList: cpuPath || [],
      categorizedList: uniqueCPUs || [],
    },
    {
      category: RAM,
      isFiltered: false,
      filteredList: ramPath || [],
      categorizedList: uniqueRAMs || [],
    },
    {
      category: GPU,
      isFiltered: false,
      filteredList: gpuPath || [],
      categorizedList: uniqueGPUs || [],
    },
    {
      category: SCREEN_SIZE,
      isFiltered: false,
      filteredList: screenSizePath || [],
      categorizedList: uniqueScreenSizes || [],
    },
    {
      category: WEIGHT,
      isFiltered: false,
      filteredList: weightPath || [],
      categorizedList: uniqueWeights || [],
    },
  ]);

  const filterSearch = ({ key, value }) => {
    const path = router.pathname;
    const query = router.query;

    if (key === BRAND) {
      if (value) {
        query.brand = value;
      } else {
        delete query.brand;
      }
    }

    if (key === CPU) {
      if (value) {
        query.cpu = value;
      } else {
        delete query.cpu;
      }
    }

    if (key === RAM) {
      if (value) {
        query.ram = value;
      } else {
        delete query.ram;
      }
    }

    if (key === GPU) {
      if (value) {
        query.gpu = value;
      } else {
        delete query.gpu;
      }
    }

    if (key === SCREEN_SIZE) {
      if (value) {
        query.screenSize = value;
      } else {
        delete query.screenSize;
      }
    }

    if (key === WEIGHT) {
      if (value) {
        query.weight = value;
      } else {
        delete query.weight;
      }
    }

    if (key === PRICE) {
      if (value) {
        query.price = value;
      } else {
        delete query.price;
      }
    }

    if (key === SORT) {
      if (value) {
        query.sort = value;
      } else {
        delete query.sort;
      }
    }

    // If querying by key page, remove other query keys
    if (key === PAGE) {
      if (value) {
        query.page = value;
      } else {
        query.page = 1;
      }
    } else {
      if (query.page) {
        query.page = 1;
      }
    }

    router.push({
      pathname: path,
      query: query,
    });

    filterRef.current.scrollIntoView({ behavior: 'auto' });
  };

  const sortChangeHandler = (e) => {
    const key = SORT;
    const value = e.target.value !== 'featured' ? e.target.value : '';

    filterSearch({ key, value });
  };

  const addToCartHandler = (product) => {
    // If item does not exist in cart
    if (cart.find((item) => item._id === product._id)) {
      console.log('Increase quantity of item');
      cartDispatch({
        type: UPDATE_ITEM_QUANTITY,
        payload: { _id: product._id, quantity: 1 },
      });
    } else {
      console.log('New item');
      cartDispatch({ type: ADD_NEW_ITEM, payload: product });
    }

    const msg = `Added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  const toggleFilterHandler = (filterBy) => {
    const idx = filterByList.findIndex(
      (filterByItem) => filterByItem.category === filterBy.category
    );
    const newFilterBy = {
      ...filterBy,
      isFiltered: !filterBy.isFiltered,
    };

    setFilterByList(
      filterByList
        .slice(0, idx)
        .concat(newFilterBy)
        .concat(filterByList.slice(idx + 1, filterByList.length))
    );
  };

  const toggleFilterTagHandler = (filterByCategory, tag) => {
    const filterBy = filterByList.find(
      (filterByItem) => filterByItem.category === filterByCategory
    );

    const filterByIdx = filterByList.findIndex(
      (filterByItem) => filterByItem.category === filterByCategory
    );

    const newFilterBy = {
      ...filterBy,
      filteredList: filterBy.filteredList.includes(tag)
        ? [...filterBy.filteredList.filter((item) => item !== tag)]
        : [...filterBy.filteredList, tag],
    };

    setFilterByList(
      filterByList
        .slice(0, filterByIdx)
        .concat(newFilterBy)
        .concat(filterByList.slice(filterByIdx + 1, filterByList.length))
    );

    const key = filterByCategory;
    var value = null;

    if (filterBy.filteredList.includes(tag)) {
      value =
        filterBy.filteredList.length > 1
          ? filterBy.filteredList.filter((item) => item !== tag).join(',')
          : '';
    } else {
      value = filterBy.filteredList.concat(tag).join(',');
    }

    filterSearch({ key, value });
  };

  const tags = filterByList.reduce((acc, next) => {
    const list = next.filteredList.map((tag) => ({
      category: next.category,
      tag: tag,
    }));

    return acc.concat(list);
  }, []);

  const saveItemHandler = (itemId) => {
    if (favs.includes(itemId)) {
      dispatch({ type: 'REMOVE_FROM_FAV', payload: itemId });
    } else {
      dispatch({ type: ADD_TO_FAV, payload: itemId });
      const msg = 'Item saved';
      enqueueSnackbar(msg, { variant: 'success' });
    }
    closeSnackbar();
  };

  useEffect(() => {
    if (router.query && Object.keys(router.query).length > 0) {
      filterRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [router.query]);

  return (
    <Layout isAtHomePage={isAtHomePage}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Hero banner section */}
        <Box
          sx={{
            position: 'relative',
            backgroundImage: `url(/heros/hero1.jpg)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundOrigin: 'border-box',
            minHeight: '100vh',
          }}
        ></Box>

        {/* Main section */}
        <Box
          ref={filterRef}
          className={classes.main}
          sx={{ minHeight: '100vh' }}
        >
          <Grid container spacing={5}>
            {/* Filter section */}
            <Grid item xs={12} md={3} lg={3} xl={3}>
              <SelectByFilter
                categories={filterByList}
                toggleFilterHandler={toggleFilterHandler}
                toggleFilterTagHandler={toggleFilterTagHandler}
                filterSearch={filterSearch}
              />
            </Grid>
            {/* Product section */}
            <Grid item container xs={12} md={9} lg={9} xl={9} spacing={3}>
              <List sx={{ flex: 1 }}>
                {/* Sort section */}
                <ListItem>
                  <Grid item md={12} xl={12}>
                    <Box sx={{ flex: 1 }}>
                      {query && query != 'all' && (
                        <Typography>{`Search for ${query}`}</Typography>
                      )}
                      {filterByList.some(
                        (filterBy) => filterBy.filteredList.length > 0
                      ) && (
                        <Box
                          sx={{
                            p: 5,
                            backgroundColor: '#d9e3f0',
                            borderRadius: 3,
                          }}
                        >
                          <Typography className={classes.bold}>
                            {countProducts} items satisfied with your choices.
                          </Typography>
                          <Controller
                            name="autocomplete-controller"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                readOnly
                                freeSolo
                                multiple
                                fullWidth
                                id="autocomplete-controller"
                                value={tags}
                                options={tags}
                                getOptionLabel={(option) => option.tag}
                                renderTags={(value, getTagProps) =>
                                  value.map((option, index) => (
                                    <FilterChip
                                      key={index}
                                      category={option.category}
                                      tag={option.tag}
                                      toggleFilterTagHandler={
                                        toggleFilterTagHandler
                                      }
                                      {...getTagProps({ index })}
                                    />
                                  ))
                                }
                                renderInput={(params) => {
                                  return (
                                    <TextField
                                      {...params}
                                      label="Filtering"
                                      variant="standard"
                                    />
                                  );
                                }}
                              />
                            )}
                          ></Controller>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Sort fontSize="medium" />
                          <Typography sx={{ ml: 1 }}>Sort by</Typography>
                          <FormControl id="radio-group">
                            <RadioGroup
                              aria-labelledby="radio-group"
                              row
                              value={sort}
                              onChange={sortChangeHandler}
                              sx={{ ml: 5 }}
                            >
                              {orderFilters.map((orderFilter) => (
                                <FormControlLabel
                                  key={orderFilter.label}
                                  {...orderFilter}
                                  control={<Radio />}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </Box>
                        <Typography
                          className={classes.bold}
                        >{`${countProducts} items`}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </ListItem>

                {/* Product display section */}
                <ListItem>
                  <Grid item container xs={12} md={12} xl={12} spacing={3}>
                    {products.map((product, index) => (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        lg={index % BREAK_ITEM_INDEX > 1 ? 4 : 6}
                        xl={index % BREAK_ITEM_INDEX > 2 ? 3 : 4}
                        key={product.name}
                      >
                        <ProductCard
                          product={product}
                          addToCartHandler={addToCartHandler}
                          saveItemHandler={saveItemHandler}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </ListItem>

                {/* Pagnition seciton */}
                <ListItem>
                  <Grid
                    item
                    md={12}
                    xl={12}
                    sx={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center ',
                    }}
                  >
                    <Pagination
                      pagesCount={pages}
                      page={query.page}
                      filterSearch={filterSearch}
                    />
                  </Grid>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const isAtHomePage = query || Object.keys(query).length === 0 ? true : false;

  console.log('isAtHomePage:', isAtHomePage);
  const scrollToFilterView =
    query && Object.keys(query).length > 0 ? true : false;

  await db.connect();

  // There is a query
  const page = query.page || 1;
  // const price = query.price || '';
  const brand = query.brand ? query.brand.split(',') : '';
  const ram = query.ram ? query.ram.split(',').map((e) => parseInt(e)) : '';
  const cpu = query.cpu ? query.cpu.split(',') : '';
  const gpu = query.gpu ? query.gpu.split(',') : '';
  const screenSize = query.screenSize ? query.screenSize.split(',') : '';
  const weight = query.weight
    ? query.weight.split(',').map((e) => parseFloat(e))
    : '';
  // const searchQuery = query.query || '';
  const sort = query.sort || '';

  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'highest'
      ? { price: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  // const queryFilter =
  //   query && query != 'all'
  //     ? {
  //         name: {
  //           $regex: searchQuery,
  //           $options: 'i',
  //         },
  //       }
  //     : {};

  // const priceBoundary = price.split('-');

  // const priceFilter =
  //   price &&
  //   price != 'all' &&
  //   (Number(priceBoundary[0]) > MINIMUM_PRICE_BOUNDARY ||
  //     Number(priceBoundary[1]) < MAXIMUM_PRICE_BOUNDARY)
  //     ? {
  //         price: {
  //           $gte: Number(priceBoundary[0]),
  //           $lte: Number(priceBoundary[1]),
  //         },
  //       }
  //     : priceBoundary[0] === priceBoundary[1] &&
  //       priceBoundary[0] === MINIMUM_PRICE_BOUNDARY
  //     ? {
  //         price: {
  //           $Lte: Number(priceBoundary[0]),
  //         },
  //       }
  //     : priceBoundary[0] === priceBoundary[1] &&
  //       priceBoundary[1] === MAXIMUM_PRICE_BOUNDARY
  //     ? {
  //         price: {
  //           $gte: Number(priceBoundary[1]),
  //         },
  //       }
  //     : {};

  // const brandFilter =
  //   brand && brand != 'all'
  //     ? {
  //         brand: {
  //           $in: brand,
  //         },
  //       }
  //     : {};

  // const ramFilter =
  //   ram && ram != 'all'
  //     ? {
  //         'processorAndMemory.ram': {
  //           $in: ram,
  //         },
  //       }
  //     : {};

  // const cpuFilter =
  //   cpu && cpu != 'all'
  //     ? {
  //         'processorAndMemory.processorName': {
  //           $in: cpu,
  //         },
  //       }
  //     : {};

  // const gpuFilter =
  //   gpu && gpu != 'all'
  //     ? {
  //         'processorAndMemory.graphicProcessor': {
  //           $in: gpu,
  //         },
  //       }
  //     : {};

  // const screenSizeFilter =
  //   screenSize && screenSize != 'all'
  //     ? {
  //         'displayAndAudio.screenSize': {
  //           $in: screenSize,
  //         },
  //       }
  //     : {};

  // const weightFilter =
  //   weight && weight != 'all'
  //     ? {
  //         'dimensions.weight': {
  //           $in: weight,
  //         },
  //       }
  //     : {};

  // const products = await Product.find({
  //   ...queryFilter,
  //   ...priceFilter,
  //   ...brandFilter,
  //   ...ramFilter,
  //   ...cpuFilter,
  //   ...gpuFilter,
  //   ...screenSizeFilter,
  //   ...weightFilter,
  // })
  //   .sort(order)
  //   .skip(PAGE_SIZE * (page - 1))
  //   .limit(PAGE_SIZE)
  //   .lean();

  const countProducts = await Product.countDocuments({});

  // const uniqueBrands = await Product.find({}).distinct('brand');
  // const uniqueCPUs = await Product.find({}).distinct(
  //   'processorAndMemory.processorName'
  // );
  // const uniqueRAMs = await Product.find({}).distinct('processorAndMemory.ram');
  // const uniqueGPUs = await Product.find({}).distinct(
  //   'processorAndMemory.graphicProcessor'
  // );
  // const uniqueScreenSizes = await Product.find({}).distinct(
  //   'displayAndAudio.screenSize'
  // );
  // const uniqueWeights = await Product.find({}).distinct('dimensions.weight');

  const products = await Product.find({})
    .sort(order)
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE)
    .lean();

  await db.disconnect();

  return {
    props: {
      scrollToFilterView,
      isAtHomePage,

      // uniqueBrands,
      // uniqueCPUs,
      // uniqueGPUs,
      // uniqueRAMs,
      // uniqueScreenSizes,
      // uniqueWeights,
      // countProducts,

      brandPath: brand,
      ramPath: ram,
      cpuPath: cpu,
      gpuPath: gpu,
      screenSizePath: screenSize,
      weightPath: weight,

      products: products.map(db.convertMongoDocToObject),
      pages: Math.ceil(countProducts / PAGE_SIZE),
    },
  };
}

export default dynamic(() => Promise.resolve(Home), { ssr: true });

import {
  Autocomplete,
  Box,
  Chip,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  TextField,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  ListItemIcon,
  PaginationItem,
  Paper,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import Layout from '../layouts/Layout';
import { arrayOfRange, capitalize } from '../utils/helpers';
import db from '../utils/db';
import Product from '../models/Product';
import { useContext, useEffect, useRef, useState } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import ProductItem from '../components/ProductItem/ProductItem';
import {
  Add,
  ArrowLeft,
  ArrowRight,
  FilterList,
  Remove,
  Sort,
} from '@mui/icons-material';
import { useStyles } from '../utils/styles';
import ButtonComponentTag from '../components/ButtonComponentTag';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import StyledSlider from '../components/StyledSlider';
import NextImage from 'next/image';
import hero from '../public/heros/hero1.jpg';
import dynamic from 'next/dynamic';
import FilterChip from '../components/FilterChip/FilterChip';

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

const brandImages = [
  '/brands/acer.png',
  '/brands/asus.png',
  '/brands/dell.png',
  '/brands/hp.png',
  '/brands/lenovo.png',
  '/brands/msi.png',
  '/brands/realme.png',
  '/brands/redmibook.png',
];

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

const settings = {
  itemsToScroll: 1,
  initialActiveIndex: 0,
  focusOnSelect: true,
  // enableAutoPlay: 1000,
  // outerSpacing: 200,
  itemPadding: [0, 5],
  breakPoints: [
    { width: 1, itemsToShow: 4 },
    { width: 600, itemsToShow: 5 },
    { width: 960, itemsToShow: 6 },
  ],
};

function Home(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const { products, pages, countProducts } = props;
  const { brandPath, ramPath, cpuPath, gpuPath, screenSizePath, weightPath } =
    props;
  const {
    categorizedBrands,
    categorizedCPUs,
    categorizedRAMs,
    categorizedGPUs,
    categorizedScreens,
    categorizedWeights,
  } = props;
  const { isAtHomePage, scrollToFilterView } = props;
  const { favs } = state;

  const { query = 'all', sort = 'featured' } = router.query;

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [priceBoundary, setPriceBoundary] = useState([
    MINIMUM_PRICE_BOUNDARY,
    MAXIMUM_PRICE_BOUNDARY,
  ]);

  const filterRef = useRef();

  const [filterByList, setFilterByList] = useState([
    {
      category: BRAND,
      isFiltered: false,
      filteredList: brandPath || [],
      categorizedList: categorizedBrands,
    },
    {
      category: CPU,
      isFiltered: false,
      filteredList: cpuPath || [],
      categorizedList: categorizedCPUs,
    },
    {
      category: RAM,
      isFiltered: false,
      filteredList: ramPath || [],
      categorizedList: categorizedRAMs,
    },
    {
      category: GPU,
      isFiltered: false,
      filteredList: gpuPath || [],
      categorizedList: categorizedGPUs,
    },
    {
      category: SCREEN_SIZE,
      isFiltered: false,
      filteredList: screenSizePath || [],
      categorizedList: categorizedScreens,
    },
    {
      category: WEIGHT,
      isFiltered: false,
      filteredList: weightPath || [],
      categorizedList: categorizedWeights,
    },
  ]);

  const filterSearch = ({ queryKey, queryValue }) => {
    const path = router.pathname;
    const query = router.query;

    if (queryKey === BRAND) {
      if (queryValue) {
        query.brand = queryValue;
      } else {
        delete query.brand;
      }
    }

    if (queryKey === CPU) {
      if (queryValue) {
        query.cpu = queryValue;
      } else {
        delete query.cpu;
      }
    }

    if (queryKey === RAM) {
      if (queryValue) {
        query.ram = queryValue;
      } else {
        delete query.ram;
      }
    }

    if (queryKey === GPU) {
      if (queryValue) {
        query.gpu = queryValue;
      } else {
        delete query.gpu;
      }
    }

    if (queryKey === SCREEN_SIZE) {
      if (queryValue) {
        query.screenSize = queryValue;
      } else {
        delete query.screenSize;
      }
    }

    if (queryKey === WEIGHT) {
      if (queryValue) {
        query.weight = queryValue;
      } else {
        delete query.weight;
      }
    }

    if (queryKey === PAGE) {
      if (queryValue) {
        query.page = queryValue;
      } else {
        delete query.page;
      }
    }

    if (queryKey === PRICE) {
      if (queryValue) {
        query.price = queryValue;
      } else {
        delete query.price;
      }
    }

    if (queryKey === SORT) {
      if (queryValue) {
        query.sort = queryValue;
      } else {
        delete query.sort;
      }
    }

    router.push({
      pathname: path,
      query: query,
    });

    filterRef.current.scrollIntoView({ behavior: 'auto' });
  };

  const pageChangeHandler = (e, page) => {
    const queryKey = PAGE;
    const queryValue = parseInt(page) > 1 ? page : '';

    filterSearch({ queryKey, queryValue });
    // filterSearch({ page });
  };

  const priceChangeHandler = (e, value) => {
    setPriceBoundary(value);
    const queryKey = PRICE;
    const queryValue = value.some((e, i) => e !== PRICE_BOUNDARY[i])
      ? value.join('-')
      : '';

    filterSearch({ queryKey, queryValue });
  };

  const sortChangeHandler = (e) => {
    const queryKey = SORT;
    const queryValue = e.target.value !== 'featured' ? e.target.value : '';

    filterSearch({ queryKey, queryValue });
  };

  const addToCartHandler = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product._id });

    const msg = `${capitalize(product.category)} ${product.name} added to cart`;
    enqueueSnackbar(msg, { variant: 'success' });
    closeSnackbar();
  };

  const toggleFilterByHandler = (filterBy) => {
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

  const toggleTagFilterHandler = (filterByCategory, tag) => {
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

    const queryKey = filterByCategory;
    var queryValue = null;

    if (filterBy.filteredList.includes(tag)) {
      queryValue =
        filterBy.filteredList.length > 1
          ? filterBy.filteredList.filter((item) => item !== tag).join(',')
          : '';
    } else {
      queryValue = filterBy.filteredList.concat(tag).join(',');
    }

    filterSearch({ queryKey, queryValue });
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
      dispatch({ type: 'ADD_TO_FAV', payload: itemId });
      const msg = 'Item saved';
      enqueueSnackbar(msg, { variant: 'success' });
    }
    closeSnackbar();
  };

  useEffect(() => {
    if (router.query && Object.keys(router.query).length > 0) {
      console.log('SCROLL!');
      filterRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [router.query]);

  useEffect(() => {
    console.log(categorizedWeights);
    console.log(weightPath);
  }, []);

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
            <Grid item container xs={12} md={3} lg={3} xl={3}>
              <Grid item>
                <Box sx={{ position: 'sticky', top: 10 }}>
                  <List
                    sx={{
                      '& .MuiListItemButton-root:hover': {
                        color: 'primary.main',
                        bgcolor: 'grey.400',
                      },
                      '& .Mui-selected': {
                        bgcolor: 'secondary.light',
                      },
                      '& .Mui-selected:hover': {
                        bgcolor: '#D9D9D9',
                      },
                      '& 	.MuiListItemText-primary': {
                        fontWeight: 'bold',
                      },
                    }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <FilterList />
                      </ListItemIcon>
                      <ListItemText primary="Filtering" />
                    </ListItem>
                    <ListItem>
                      <Box
                        sx={{ display: 'flex', flexFlow: 'column', flex: 1 }}
                      >
                        <List>
                          <ListItemText primary="Price Boundary" />

                          <ListItem>
                            <StyledSlider
                              min={MINIMUM_PRICE_BOUNDARY}
                              max={MAXIMUM_PRICE_BOUNDARY}
                              step={PRICE_STEP}
                              value={priceBoundary}
                              // defaultValue={priceBoundary}
                              valueLabelDisplay="auto"
                              onChange={priceChangeHandler}
                              marks={arrayOfRange(
                                MINIMUM_PRICE_BOUNDARY,
                                MAXIMUM_PRICE_BOUNDARY,
                                PRICE_STEP,
                                true
                              ).map((e) => ({
                                value: e,
                                label: (e / Math.pow(10, 6))
                                  .toString()
                                  .concat('M'),
                              }))}
                            />
                          </ListItem>
                        </List>
                      </Box>
                    </ListItem>
                    <Divider />
                    {filterByList.map((filterBy, index) => (
                      <div key={filterBy.category}>
                        <ListItemButton
                          selected={filterBy.filteredList.length > 0}
                          onClick={() => toggleFilterByHandler(filterBy)}
                        >
                          <ListItemText
                            primary={`${filterBy.category} ${
                              filterBy.filteredList.length > 0
                                ? `(${filterBy.filteredList.length})`
                                : ''
                            } `}
                          />
                          {filterBy.isFiltered ? <Remove /> : <Add />}
                        </ListItemButton>
                        <Collapse in={filterBy.isFiltered} timeout="auto">
                          <Box
                            sx={{
                              display: 'flex',
                              flexFlow: 'wrap',
                              pt: 2,
                              pb: 2,
                            }}
                          >
                            {filterBy.categorizedList.map((tag) => (
                              <ButtonComponentTag
                                category={filterBy.category}
                                key={tag}
                                tag={tag}
                                clicked={filterBy.filteredList.includes(tag)}
                                toggleTagFilterHandler={() =>
                                  toggleTagFilterHandler(filterBy.category, tag)
                                }
                              />
                            ))}
                          </Box>
                        </Collapse>
                        {index < filterByList.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </Box>
              </Grid>
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
                                      toggleTagFilterHandler={
                                        toggleTagFilterHandler
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
                        // sm={12}
                        xs={12}
                        md={6}
                        lg={index % BREAK_ITEM_INDEX > 1 ? 4 : 6}
                        xl={index % BREAK_ITEM_INDEX > 2 ? 3 : 4}
                        // xl={6}
                        key={product.name}
                      >
                        <ProductItem
                          // saved={favs.includes(product._id)}
                          product={product}
                          addToCartHandler={addToCartHandler}
                          saveItemHandler={saveItemHandler}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </ListItem>

                <ListItem>
                  {/* Pagnition seciton */}
                  <Grid
                    item
                    md={12}
                    xl={12}
                    sx={{
                      // bgcolor: 'gray',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center ',
                    }}
                  >
                    <Pagination
                      showFirstButton
                      showLastButton
                      shape="rounded"
                      boundaryCount={1}
                      renderItem={(item) => (
                        <PaginationItem
                          components={{
                            previous: ArrowLeft,
                            next: ArrowRight,
                          }}
                          {...item}
                        />
                      )}
                      count={pages}
                      defaultPage={parseInt(query.page || '1')}
                      onChange={pageChangeHandler}
                    ></Pagination>
                  </Grid>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Display section */}
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  // const isAtHomePage = query && Object.keys(query).length === 0 ? true : false;
  const scrollToFilterView =
    query && Object.keys(query).length > 0 ? true : false;
  console.log(scrollToFilterView);
  const isAtHomePage = true;
  console.log(`Query in router = ${query}`);
  const page = query.page || 1;
  const price = query.price || '';
  const brand = query.brand ? query.brand.split(',') : '';
  const ram = query.ram ? query.ram.split(',').map((e) => parseInt(e)) : '';
  const cpu = query.cpu ? query.cpu.split(',') : '';
  const gpu = query.gpu ? query.gpu.split(',') : '';
  const screenSize = query.screenSize ? query.screenSize.split(',') : '';
  const weight = query.weight
    ? query.weight.split(',').map((e) => parseFloat(e))
    : '';
  const searchQuery = query.query || '';
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

  const queryFilter =
    query && query != 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const priceBoundary = price.split('-');
  const priceFilter =
    price &&
    price != 'all' &&
    (Number(priceBoundary[0]) > MINIMUM_PRICE_BOUNDARY ||
      Number(priceBoundary[1]) < MAXIMUM_PRICE_BOUNDARY)
      ? {
          price: {
            $gte: Number(priceBoundary[0]),
            $lte: Number(priceBoundary[1]),
          },
        }
      : priceBoundary[0] === priceBoundary[1] &&
        priceBoundary[0] === MINIMUM_PRICE_BOUNDARY
      ? {
          price: {
            $Lte: Number(priceBoundary[0]),
          },
        }
      : priceBoundary[0] === priceBoundary[1] &&
        priceBoundary[1] === MAXIMUM_PRICE_BOUNDARY
      ? {
          price: {
            $gte: Number(priceBoundary[1]),
          },
        }
      : {};

  const brandFilter =
    brand && brand != 'all'
      ? {
          brand: {
            $in: brand,
          },
        }
      : {};

  const ramFilter =
    ram && ram != 'all'
      ? {
          'processorAndMemory.ram': {
            $in: ram,
          },
        }
      : {};

  const cpuFilter =
    cpu && cpu != 'all'
      ? {
          'processorAndMemory.processorName': {
            $in: cpu,
          },
        }
      : {};

  const gpuFilter =
    gpu && gpu != 'all'
      ? {
          'processorAndMemory.graphicProcessor': {
            $in: gpu,
          },
        }
      : {};

  const screenSizeFilter =
    screenSize && screenSize != 'all'
      ? {
          'displayAndAudio.screenSize': {
            $in: screenSize,
          },
        }
      : {};

  const weightFilter =
    weight && weight != 'all'
      ? {
          'dimensions.weight': {
            $in: weight,
          },
        }
      : {};

  await db.connect();
  const products = await Product.find({
    ...queryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ramFilter,
    ...cpuFilter,
    ...gpuFilter,
    ...screenSizeFilter,
    ...weightFilter,
  })
    .sort(order)
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ramFilter,
    ...cpuFilter,
    ...gpuFilter,
    ...screenSizeFilter,
    ...weightFilter,
  });

  const categorizedBrands = await Product.find({}).distinct('brand');
  const categorizedCPUs = await Product.find({}).distinct(
    'processorAndMemory.processorName'
  );
  const categorizedRAMs = await Product.find({}).distinct(
    'processorAndMemory.ram'
  );
  const categorizedGPUs = await Product.find({}).distinct(
    'processorAndMemory.graphicProcessor'
  );
  const categorizedScreens = await Product.find({}).distinct(
    'displayAndAudio.screenSize'
  );
  const categorizedWeights = await Product.find({}).distinct(
    'dimensions.weight'
  );
  await db.disconnect();

  return {
    props: {
      scrollToFilterView,
      isAtHomePage,
      brandPath: brand,
      ramPath: ram,
      cpuPath: cpu,
      gpuPath: gpu,
      screenSizePath: screenSize,
      weightPath: weight,
      products: products.map(db.convertMongoDocToObject),
      categorizedBrands,
      categorizedCPUs,
      categorizedRAMs,
      categorizedGPUs,
      categorizedScreens,
      categorizedWeights,
      countProducts,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    },
  };
}

export default dynamic(() => Promise.resolve(Home), { ssr: true });

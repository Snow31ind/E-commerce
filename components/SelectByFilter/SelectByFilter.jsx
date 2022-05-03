import { Add, FilterList, Remove } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import { PRICE } from '../../constants';
import { arrayOfRange } from '../../utils/helpers';
import ButtonComponentTag from '../ButtonComponentTag';
import StyledSlider from '../StyledSlider';

const MINIMUM_PRICE_BOUNDARY = Math.pow(10, 7);
const MAXIMUM_PRICE_BOUNDARY = 4 * Math.pow(10, 7);
const PRICE_STEP = 5 * Math.pow(10, 6);
const PRICE_BOUNDARY = [MINIMUM_PRICE_BOUNDARY, MAXIMUM_PRICE_BOUNDARY];

const SelectByFilter = ({
  categories,
  filterSearch,
  toggleFilterHandler,
  toggleFilterTagHandler,
}) => {
  const [priceBoundary, setPriceBoundary] = useState(PRICE_BOUNDARY);

  const priceChangeHandler = (e, newValue) => {
    setPriceBoundary(newValue);

    const query = {
      key: PRICE,
      value: newValue.some((val, idx) => val !== PRICE_BOUNDARY[idx])
        ? newValue.join('-')
        : '',
    };

    // filterSearch(query);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List
        sx={{
          flex: 1,
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
          <ListItemText primary="Filter" />
        </ListItem>

        {/* Filter by price */}
        <ListItem sx={{ flex: 1 }}>
          <StyledSlider
            valueLabelDisplay="auto"
            min={MINIMUM_PRICE_BOUNDARY}
            max={MAXIMUM_PRICE_BOUNDARY}
            step={PRICE_STEP}
            value={priceBoundary}
            onChange={priceChangeHandler}
            marks={arrayOfRange(
              MINIMUM_PRICE_BOUNDARY,
              MAXIMUM_PRICE_BOUNDARY,
              PRICE_STEP,
              true
            ).map((value) => ({
              value: value,
              label: (value / Math.pow(10, 6)).toString().concat('M'),
            }))}
          />
        </ListItem>

        <Divider />

        {categories.length &&
          categories.map((category, index) => (
            <Box key={category.category}>
              <ListItemButton
                selected={category.filteredList.length > 0}
                onClick={() => toggleFilterHandler(category)}
              >
                <ListItemText
                  primary={
                    category.filteredList.length > 0
                      ? `${category.category} ${category.filteredList.length}`
                      : `${category.category}`
                  }
                />
                {category.isFiltered ? <Remove /> : <Add />}
              </ListItemButton>
              <Collapse in={category.isFiltered} timeout="auto" unmountOnExit>
                <Box sx={{ display: 'flex', flexFlow: 'wrap', pt: 2, pb: 2 }}>
                  {category.categorizedList.map((tag) => (
                    <ButtonComponentTag
                      key={tag}
                      category={category.category}
                      tag={tag}
                      clicked={category.filteredList.includes(tag)}
                      toggleFilterTagHandler={() =>
                        toggleFilterTagHandler(category.category, tag)
                      }
                    />
                  ))}
                </Box>
              </Collapse>
              {index < categories.length - 1 && <Divider />}
            </Box>
          ))}
      </List>
    </Box>
  );
};

export default SelectByFilter;

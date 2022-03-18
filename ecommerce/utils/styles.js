import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  brand: {
    fontWeight: 'bold',
  },
  navbar: {
    // backgroundColor: '#F0F0F0',
    '& a': {
      color: 'black',
    },
  },
  grow: {
    flexGrow: 1,
  },
  main: {},
});

export { useStyles };

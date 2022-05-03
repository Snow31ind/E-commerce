import {
  Category,
  Dashboard as DashboardIcon,
  Group,
  Receipt,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import NextLink from 'next/link';

const sections = [
  {
    label: 'Dashboard',
    value: 'dashboard',
    href: '/admin/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Orders',
    value: 'orders',
    href: '/admin/orders',
    icon: <Receipt />,
  },
  {
    label: 'Products',
    value: 'products',
    href: '/admin/products',
    icon: <Category />,
  },
  {
    label: 'Users',
    value: 'users',
    href: '/admin/users',
    icon: <Group />,
  },
];

export default function Dashboard({ selectedSection }) {
  return (
    <List>
      {sections.map((section) => (
        <ListItemButton
          divider
          key={section.label}
          selected={selectedSection === section.value}
        >
          <ListItemIcon>{section.icon}</ListItemIcon>
          <NextLink href={section.href} passHref>
            <ListItemText primary={section.label} />
          </NextLink>
        </ListItemButton>
      ))}
    </List>
  );
}

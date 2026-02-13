import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link as MuiLink,
  Container,
} from "@mui/material";
import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/occurrence", label: "Occurrence" },
  { to: "/identification", label: "Identification" },
];

const footerLinks = [
  { href: "https://observ.ing", label: "Observ.ing" },
  { href: "https://atproto.com/", label: "AT Protocol" },
  { href: "https://dwc.tdwg.org/", label: "Darwin Core" },
  { href: "https://www.gbif.org/", label: "GBIF" },
  { href: "https://github.com/lexicons-bio/lexicons", label: "GitHub" },
];

export default function Layout() {
  return (
    <>
      <AppBar position="sticky" color="default">
        <Toolbar
          variant="dense"
          sx={{ maxWidth: 960, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "primary.main",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              mr: 4,
            }}
          >
            lexicons.bio
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {navItems.map(({ to, label }) => (
              <Typography
                key={to}
                component={NavLink}
                to={to}
                end={to === "/"}
                sx={{
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  textDecoration: "none",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "6px",
                  transition: "background 0.15s, color 0.15s",
                  "&:hover": { bgcolor: "background.paper", color: "text.primary" },
                  "&.active": {
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontWeight: 500,
                  },
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          <MuiLink
            href="https://github.com/lexicons-bio/lexicons"
            target="_blank"
            rel="noopener"
            sx={{
              ml: "auto",
              fontSize: "0.8rem",
              color: "text.disabled",
              textDecoration: "none",
              "&:hover": { color: "text.secondary" },
            }}
          >
            GitHub ↗
          </MuiLink>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ maxWidth: 960, px: { xs: 2, sm: 3 }, py: 4, pb: 8 }}>
        <Outlet />

        <Box
          component="footer"
          sx={{
            borderTop: 1,
            borderColor: "divider",
            mt: 6,
            pt: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {footerLinks.map(({ href, label }) => (
            <MuiLink
              key={href}
              href={href}
              target="_blank"
              rel="noopener"
              sx={{
                fontSize: "0.8rem",
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "text.primary" },
              }}
            >
              {label}
            </MuiLink>
          ))}
        </Box>
      </Container>
    </>
  );
}

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PublicIcon from '@mui/icons-material/Public';

type Place = {
  name: string;
  address: string;
  note?: string;
  website?: string;
};

type Section = {
  title: string;
  items: Place[];
};

// Map link helper (same behavior as Details/Timeline)
const getMapLink = (address: string) => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    const isMobile = /Mobi|Android|iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    if (isMobile) {
      if (isAndroid) return `geo:0,0?q=${encodeURIComponent(address)}`;
      if (isIOS) return `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
    }
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
};

const SECTIONS: Section[] = [
  {
    title: 'Coffee & Brunch',
    items: [
      {
        name: 'Storyville Coffee (Pike Place)',
        address: '94 Pike St #34, Seattle, WA 98101',
        note: 'Cozy spot above the Market.',
        website: 'https://www.storyville.com',
      },
      {
        name: 'Portage Bay Cafe',
        address: '4130 Roosevelt Way NE, Seattle, WA 98105',
        note: 'Local favorite with a toppings bar.',
        website: 'https://www.portagebaycafe.com',
      },
      {
        name: 'Victrola Coffee Roasters',
        address: '310 E Pike St, Seattle, WA 98122',
        note: 'Capitol Hill roastery.',
        website: 'https://www.victrolacoffee.com',
      },
    ],
  },
  {
    title: 'Sights & Walks',
    items: [
      {
        name: 'Pike Place Market',
        address: '85 Pike St, Seattle, WA 98101',
        note: 'Iconic market—flowers, food stalls, views.',
        website: 'https://pikeplacemarket.org',
      },
      {
        name: 'Kerry Park',
        address: '211 W Highland Dr, Seattle, WA 98119',
        note: 'Best skyline photo at sunset.',
      },
      {
        name: 'Gas Works Park',
        address: '2101 N Northlake Way, Seattle, WA 98103',
        note: 'Lake Union views + picnic lawns.',
      },
      {
        name: 'Discovery Park Loop',
        address: '3801 Discovery Park Blvd, Seattle, WA 98199',
        note: 'Easy coastal loop with lighthouse.',
      },
    ],
  },
  {
    title: 'Date Night',
    items: [
      {
        name: 'The Pink Door',
        address: '1919 Post Alley, Seattle, WA 98101',
        note: 'Italian with a view—book ahead.',
        website: 'https://thepinkdoor.net',
      },
      {
        name: 'Smith Tower Observatory Bar',
        address: '506 2nd Ave, Seattle, WA 98104',
        note: 'Speakeasy vibes + 360° views.',
        website: 'https://www.smithtower.com',
      },
    ],
  },
  {
    title: 'Day Trips',
    items: [
      {
        name: 'Snoqualmie Falls',
        address: '6501 Railroad Ave SE, Snoqualmie, WA 98065',
        note: 'Stunning waterfall, short walkway.',
      },
      {
        name: 'Leavenworth Village',
        address: 'Leavenworth, WA',
        note: 'Bavarian-style mountain town.',
      },
    ],
  },
];

const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {/* full-width underline within content column */}
      <Box
          sx={{
            height: '2px',
            width: '100%',
            bgcolor: 'primary.light',
            mx: 'auto',
            my: 2,
          }}
      />
      <Box sx={{ textAlign: 'left' }}>{children}</Box>
    </Box>
);

const ItemRow: React.FC<{ place: Place }> = ({ place }) => (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
        {place.name}
      </Typography>

      {place.note && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {place.note}
          </Typography>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
        <PlaceIcon fontSize="small" />
        <MuiLink
            href={getMapLink(place.address)}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
            sx={{ wordBreak: 'break-word' }}
        >
          {place.address}
        </MuiLink>

        {place.website && (
            <>
              <Typography variant="body2" sx={{ mx: 1, color: 'text.disabled' }}>
                •
              </Typography>
              <PublicIcon fontSize="small" />
              <MuiLink
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  color="primary"
              >
                Website
              </MuiLink>
            </>
        )}
      </Stack>
    </Box>
);

const ThingsToDoComponent: React.FC = () => {
  return (
      <Container>
        {/* Centered content column */}
        <Box sx={{ maxWidth: 820, mx: 'auto' }}>
          {/* Sections */}
          <Stack spacing={4}>
            {SECTIONS.map((section) => (
                <Box key={section.title}>
                  <SectionBlock title={section.title}>
                    {section.items.map((p, idx) => (
                        <React.Fragment key={p.name}>
                          <ItemRow place={p} />
                          {idx < section.items.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                  </SectionBlock>
                </Box>
            ))}
          </Stack>
        </Box>
      </Container>
  );
};

export default ThingsToDoComponent;

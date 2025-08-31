import React, {useEffect, useMemo, useState} from 'react';
import {Box, Container, Grid2, Stack, Typography} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';

type Member = {
  name: string;
  role: string;
  photos: string[];   // root-relative public URLs
  blurb: string;
  alt?: string;
};

type Pair = { groomsman: Member; bridesmaid: Member };

// --- Small pieces ------------------------------------------------------------

const validImages = (paths: string[]) => paths.filter((p) => /\.(jpe?g|png|webp|jpeg|JPG)$/i.test(p)); // exclude HEIC

const MemberCard: React.FC<{ person: Member }> = ({person}) => {
  const fallback = '/assets/wedding-party/placeholder.jpg';

  const photos = useMemo(() => {
    const ok = validImages(person.photos);
    return ok.length ? ok : [fallback];
  }, [person.photos]);

  const [idx, setIdx] = useState(0);

  // Auto-advance every 5s
  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, 5000);
    return () => clearInterval(id);
  }, [photos.length]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget as HTMLImageElement;
    if (!img.dataset.fallback) {
      img.dataset.fallback = '1';
      img.src = fallback;
    }
  };

  const currentSrc = photos[idx];

  // Always push forward
  const direction = 1;

  const variants = {
    enter: (dir: number) => ({x: dir > 0 ? '100%' : '-100%'}),
    center: {x: '0%'},
    exit: (dir: number) => ({x: dir > 0 ? '-100%' : '100%'}),
  };

  return (
      <Stack spacing={1.25} sx={{alignItems: 'center', textAlign: 'center'}}>
        <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 1.5,
              overflow: 'hidden',
              border: (t) => `2px solid ${t.palette.divider}`,
              backgroundColor: 'secondary.light',
            }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
                key={currentSrc}
                src={currentSrc}
                alt={person.alt ?? person.name}
                onError={handleError}
                loading="lazy"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{type: 'tween', duration: 0.45, ease: 'easeInOut'}}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  willChange: 'transform',
                }}
            />
          </AnimatePresence>
        </Box>

        <Typography variant="h6" sx={{lineHeight: 1.2}}>
          {person.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{letterSpacing: 1}}>
          {person.role.toUpperCase()}
        </Typography>
        {/*<Typography variant="body2">{person.blurb}</Typography>*/}
      </Stack>
  );
};

// --- Paths (PUBLIC) ----------------------------------------------------------

const PAIRS: Pair[] = [
  // 1) Emy / Alix
  {
    groomsman: {
      name: 'Alix',
      role: 'Best Man',
      photos: [
        `/assets/wedding-party/bachelor/alix/IMG_7875.jpeg`,
        `/assets/wedding-party/bachelor/alix/alix-bad-1.jpg`,
        `/assets/wedding-party/bachelor/alix/alix-bad-2.JPG`,
        `/assets/wedding-party/bachelor/alix/alix-bad-3.jpeg`,
        `/assets/wedding-party/bachelor/alix/alix-bad-4.jpeg`,
        `/assets/wedding-party/bachelor/alix/alix-bad-5.jpg`,
        `/assets/wedding-party/bachelor/alix/alix-bad-6.jpeg`,
      ],
      blurb: 'Day-one friend with a legendary playlist.',
    },
    bridesmaid: {
      name: 'Emy',
      role: 'Maid of Honor',
      photos: [`/assets/wedding-party/baccelorette/emy/emy.jpeg`],
      blurb: 'Coffee dates and late-night talks.',
    },
  },
  // 2) Mesha / JP
  {
    groomsman: {
      name: 'JP',
      role: 'Groomsman',
      photos: [`/assets/wedding-party/bachelor/jp/IMG_9473.jpg`], // ensure converted from HEIC
      blurb: 'Tech fixer and espresso whisperer.',
    },
    bridesmaid: {
      name: 'Mesha',
      role: 'Bridesmaid',
      photos: [`/assets/wedding-party/baccelorette/mesha/misha.jpeg`], // folder "mesha", file "misha.jpeg"
      blurb: 'Laughs that light up a room.',
    },
  },
  // 3) Trinity / Nathan
  {
    groomsman: {
      name: 'Nathan',
      role: 'Groomsman',
      photos: [
        `/assets/wedding-party/bachelor/nathan/a150d2a3-0f75-478f-b7b6-cff2ab3b6df6.JPG`,
        `/assets/wedding-party/bachelor/nathan/IMG_1596.JPG`,
      ],
      blurb: 'Calm in the chaos.',
    },
    bridesmaid: {
      name: 'Trinity',
      role: 'Bridesmaid',
      photos: [`/assets/wedding-party/baccelorette/trinity/trinity.jpeg`],
      blurb: 'Brunch partner and best storyteller.',
    },
  },
  // 4) Jency / Alan
  {
    groomsman: {
      name: 'Alan',
      role: 'Groomsman',
      photos: [
        `/assets/wedding-party/bachelor/alan/alan-bad.jpg`,
        `/assets/wedding-party/bachelor/alan/alan-good.jpg`,
      ],
      blurb: 'Reserved for future shenanigans.',
    },
    bridesmaid: {
      name: 'Jency',
      role: 'Bridesmaid',
      photos: [`/assets/wedding-party/baccelorette/jency/jency.jpeg`],
      blurb: 'Makes every plan more fun.',
    },
  },
  // 5) Daphne / Jonah  (display name “Daphne”, folder “daphnie”)
  {
    groomsman: {
      name: 'Jonah',
      role: 'Groomsman',
      photos: [
        `/assets/wedding-party/bachelor/jonah/IMG_6104.jpg`,
        `/assets/wedding-party/bachelor/jonah/IMG_2223.JPG`,
        `/assets/wedding-party/bachelor/jonah/IMG_9842.jpg`,
        `/assets/wedding-party/bachelor/jonah/3266849689714258639.JPG`,
        `/assets/wedding-party/bachelor/jonah/76762713476__4B88B754-39C3-49FF-91AF-14F64B6C3681.jpg`,
        `/assets/wedding-party/bachelor/jonah/IMG_0290.jpg`,
        `/assets/wedding-party/bachelor/jonah/IMG_4998.jpeg`,
        `/assets/wedding-party/bachelor/jonah/IMG_6730.jpg`,
      ],
      blurb: 'Road-trip philosopher and snack curator.',
    },
    bridesmaid: {
      name: 'Daphne',
      role: 'Bridesmaid',
      photos: [`/assets/wedding-party/baccelorette/daphnie/daphnie.jpeg`], // keep folder name per your tree
      blurb: 'Voice of reason and spontaneous dancing.',
    },
  },
  // 6) Cielo / Jack
  {
    groomsman: {
      name: 'Jack',
      role: 'Groomsman',
      photos: [
        `/assets/wedding-party/bachelor/jack/IMG_2692.jpeg`,
        `/assets/wedding-party/bachelor/jack/IMG_3057.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_3939.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_4473_Original.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_9237.jpg`,
        `/assets/wedding-party/bachelor/jack/27690CA5-633D-4AA6-9CE8-14135BB4E90F.JPG`,
        `/assets/wedding-party/bachelor/jack/6CCB3C97-E489-4C16-A916-93212778138C.JPG`,
        `/assets/wedding-party/bachelor/jack/7_Original.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_0441.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_1204.jpg`,
        `/assets/wedding-party/bachelor/jack/IMG_6478.jpg`,
      ],
      blurb: 'Hiking buddy and grill co-conspirator.',
    },
    bridesmaid: {
      name: 'Cielo',
      role: 'Bridesmaid',
      photos: [`/assets/wedding-party/baccelorette/cielo/cielo.jpg`],
      blurb: 'Sunshine in human form.',
    },
  },
];

// --- Component ---------------------------------------------------------------
const WeddingPartyComponent: React.FC = () => {
  return (
      <Container>
        <Box sx={{maxWidth: 1100, mx: 'auto'}}>
          <Stack spacing={5}>
            {PAIRS.map((pair, idx) => (
                <Grid2 key={idx} container spacing={4} alignItems="start" justifyContent="center">
                  <Grid2 size={{xs: 6, sm: 6, md: 5}}>
                    <MemberCard person={pair.groomsman}/>
                  </Grid2>
                  <Grid2 size={{xs: 6, sm: 6, md: 5}}>
                    <MemberCard person={pair.bridesmaid}/>
                  </Grid2>
                </Grid2>
            ))}
          </Stack>
        </Box>
      </Container>
  );
};

export default WeddingPartyComponent;

import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState, type JSX } from 'react';

interface IAdaptiveMultiColumnList {
  items: JSX.Element[];
  height?: number;
  maxDesktopCols?: number;
  itemMinHeight?: number;
}
/**
 * Règle fonctionnelle :
 * - Mobile (xs/sm) : max 1 colonne (scroll si nécessaire)
 * - Desktop (md+) : 1 -> 2 -> 3 colonnes selon si le contenu dépasse la hauteur visible
 * - Si 3 colonnes débordent encore : scroll vertical
 *
 * Paramétrable :
 * - height           : hauteur visible (px) du conteneur scrollable
 * - maxDesktopCols   : plafond de colonnes sur desktop (3 par défaut)
 * - itemMinHeight    : hauteur min visuelle d’un item (cohérence d’estimation)
 */
export default function AdaptiveMultiColumnList({
  items,
  height = 500,
  maxDesktopCols = 3,
  itemMinHeight = 75,
}: IAdaptiveMultiColumnList) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs/sm = mobile

  const containerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null);

  const [containerHeight, setContainerHeight] = useState(height);
  const [measuredItemHeight, setMeasuredItemHeight] = useState(itemMinHeight);
  const [columns, setColumns] = useState(1);

  // --- Observe dynamiquement la hauteur disponible du conteneur ---
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial
    setContainerHeight(containerRef.current.clientHeight);

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        // clientHeight approximé par contentBoxSize / borderBoxSize selon le navigateur
        const h =
          entry.contentBoxSize && entry.contentBoxSize[0]
            ? entry.contentBoxSize[0].blockSize
            : entry.contentRect.height;
        setContainerHeight(h);
      }
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // --- Observe la hauteur du 1er item pour améliorer l’estimation ---
  useEffect(() => {
    if (!firstItemRef.current) return;

    // Initial
    setMeasuredItemHeight(firstItemRef.current.clientHeight || itemMinHeight);

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const h =
          entry.borderBoxSize && entry.borderBoxSize[0]
            ? entry.borderBoxSize[0].blockSize
            : entry.contentRect.height;
        // on borne pour éviter des valeurs aberrantes
        setMeasuredItemHeight(Math.max(itemMinHeight, Math.round(h)));
      }
    });

    ro.observe(firstItemRef.current);
    return () => ro.disconnect();
  }, [items, itemMinHeight]);

  // --- Calcule le nombre de colonnes souhaité selon l’overflow estimé ---
  useEffect(() => {
    // Cas bord
    if (!items || items.length === 0) {
      setColumns(1);
      return;
    }

    // Estimation simple : totalHeight ≈ heightMoyenItem * count
    // (Si tes items varient beaucoup en hauteur, voir variantes en bas)
    const totalHeight = measuredItemHeight * items.length;

    if (isMobile) {
      // Mobile : toujours 1 colonne
      setColumns(1);
      return;
    }

    // Desktop : 1 -> 2 -> 3 colonnes max
    let cols = 1;

    if (totalHeight > containerHeight) {
      cols = 2;
      if (totalHeight / 2 > containerHeight) {
        cols = Math.min(3, maxDesktopCols);
      }
    }

    setColumns(cols);
  }, [
    isMobile,
    items,
    items.length,
    measuredItemHeight,
    containerHeight,
    maxDesktopCols,
  ]);

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1, // prend tout l'espace restant dans ExercisesContainer
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // scroll interne seulement
        minHeight: 0, // important pour que flex fonctionne correctement
        px: 2,
      }}
    >
      <Grid container spacing={2} justifyContent="flex-start">
        {items.map((item, index) => (
          <Grid
            key={index}
            // xs/sm : toujours 1 colonne
            // xs={12}
            // sm={12}
            // // md+ : dynamique (12, 6, 4) selon columns
            // md={12 / columns}
            size={{ xs: 12, sm: 12, md: 12 / columns }}
            display="flex"
            alignItems="start"
          >
            {/* <Paper
              ref={index === 0 ? firstItemRef : undefined}
              sx={{
                p: 2,
                // Hauteur mini pour stabiliser un peu l’estimation
                minHeight: itemMinHeight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">{item}</Typography>
            </Paper> */}
            {item}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

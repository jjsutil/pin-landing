// How many cards one listing page ships (I-012). Owner's call, 2026-08-12: six,
// so the ~3-column grid reads as two clean rows.
//
// A build-time literal, not runtime config — this repo has no config read path
// (`config_module: none`, docs/CONFIG.md). It lives here so the four listing
// routes (ES/EN × all/topic) cannot drift apart.
export const PAGE_SIZE = 6;

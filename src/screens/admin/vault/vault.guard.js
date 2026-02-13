export function vaultGuard(session) {
  return (
    session?.isAdmin === true &&
    session?.challengePassed === true &&
    session?.vaultUnlocked === true
  )
}
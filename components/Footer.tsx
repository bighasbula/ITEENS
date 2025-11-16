'use client'

export default function Footer() {
  return (
    <footer
      className="text-sm sm:text-base text-foreground mb-2 sm:mb-3 font-body"
      style={{ textAlign: "center", marginTop: "2rem", paddingTop: "2rem", paddingBottom: "1.5rem" }}
    >
      <div className="space-y-2">
        <p className="text-muted-foreground">All rights reserved © 2025 ITEENS</p>
        <p className="text-muted-foreground">Developed with ❤️</p>
        <div className="flex justify-center items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">email: iteens.kz@yandex.kz</span>
        </div>
      </div>
    </footer>
  );
}
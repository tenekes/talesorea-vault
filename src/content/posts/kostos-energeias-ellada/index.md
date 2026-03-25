---
title: Ποιο είναι το πραγματικό κόστος
date: 2026-03-25
description: ""
tags:
  - ενέργεια
  - ΔΕΗ
  - ελλάδα
  - φωτοβολταικά
image: "[](../attachments/IMG_2045.jpg)"
imageAlt: Κόστος Ενέργειας
imageOG: false
hideCoverImage: false
hideTOC: false
targetKeyword: ""
draft: false
---
Αναρωτιέστε **ποιο είναι το πραγματικό κόστος ενέργειας στην Ελλάδα** σε σχέση με την υπόλοιπη Ευρώπη; ⚡🌍

Η ενεργειακή κρίση και οι διακυμάνσεις των αγορών έχουν κάνει την τιμή της μεγαβατώρας (MWh) καθοριστικό παράγοντα για τα νοικοκυριά και τις επιχειρήσεις.

Παρακάτω δημιουργήσαμε έναν ζωντανό πίνακα, ο οποίος ενημερώνεται **καθημερινά** και αυτόματα με τις τρέχουσες (day-ahead) τιμές χονδρικής ηλεκτρικής ενέργειας. Με αυτόν τον τρόπο, μπορείτε με μια ματιά να συγκρίνετε πώς κυμαίνονται οι τιμές ρεύματος στην Ελλάδα 🇬🇷 συγκριτικά με τις υπόλοιπες Ευρωπαϊκές χώρες 💶💡.

### Σύγκριση Τιμών

<div class="overflow-x-auto my-8">
  <table class="min-w-full text-left border-collapse border border-skin-line">
    <thead class="bg-skin-card">
      <tr>
        <th class="border border-skin-line px-4 py-3 font-semibold">Χώρα</th>
        <th class="border border-skin-line px-4 py-3 font-semibold text-right">Σημερινή Τιμή (€)</th>
        <th class="border border-skin-line px-4 py-3 font-semibold text-right" id="prev-month-header">Προηγ. Μήνας (€)</th>
        <th class="border border-skin-line px-4 py-3 font-semibold text-center">Πηγή</th>
      </tr>
    </thead>
    <tbody id="energy-tbody">
      </tbody>
  </table>
</div>

*Σημείωση: Οι παραπάνω τιμές αποτελούν τον ημερήσιο μέσο όρο των ωριαίων τιμών του Χρηματιστηρίου Ενέργειας κάθε περιοχής. Αντλούνται σε πραγματικό χρόνο από την πλατφόρμα Transparency του ENTSO-E (μέσω Energy-Charts). Τα ιστορικά δεδομένα του προηγούμενου μήνα υπολογίζονται δυναμικά.*

<script>
  document.addEventListener('astro:page-load', () => {
    const tbody = document.getElementById("energy-tbody");
    if (!tbody || tbody.dataset.running === "true") return; 
    tbody.dataset.running = "true"; 

    let isPageActive = true;
    document.addEventListener('astro:before-preparation', () => {
      isPageActive = false; 
    }, { once: true });

    const zoneNames = {
      "GR": "Ελλάδα 🇬🇷", "DE-LU": "Γερμανία/Λουξεμβούργο 🇩🇪🇱🇺", "FR": "Γαλλία 🇫🇷",
      "IT-North": "Ιταλία (Βόρεια) 🇮🇹", "ES": "Ισπανία 🇪🇸", "AT": "Αυστρία 🇦🇹",
      "BE": "Βέλγιο 🇧🇪", "NL": "Ολλανδία 🇳🇱", "PL": "Πολωνία 🇵🇱", "PT": "Πορτογαλία 🇵🇹",
      "RO": "Ρουμανία 🇷🇴", "BG": "Βουλγαρία 🇧🇬", "HU": "Ουγγαρία 🇭🇺", "CZ": "Τσεχία 🇨🇿",
      "SK": "Σλοβακία 🇸🇰", "SI": "Σλοβενία 🇸🇮", "HR": "Κροατία 🇭🇷", "RS": "Σερβία 🇷🇸",
      "CH": "Ελβετία 🇨🇭", "DK1": "Δανία 🇩🇰", "FI": "Φινλανδία 🇫🇮", "EE": "Εσθονία 🇪🇪",
      "LT": "Λιθουανία 🇱🇹", "LV": "Λετονία 🇱🇻"
    };

    const pad = n => n.toString().padStart(2, '0');
    const now = new Date();
    let prevYear = now.getFullYear();
    let prevMonth = now.getMonth(); 
    if (prevMonth === 0) { prevMonth = 12; prevYear--; }
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
    const startStr = `${prevYear}-${pad(prevMonth)}-01`;
    const endStr = `${prevYear}-${pad(prevMonth)}-${pad(daysInPrevMonth)}`;
    
    const monthNames = ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"];
    document.getElementById("prev-month-header").innerText = "Μέσος: " + monthNames[prevMonth - 1] + " " + prevYear;

    const zonesArr = Object.keys(zoneNames);

    let initialHtml = "";
    zonesArr.forEach(code => {
      const isGreece = code === "GR";
      const rowStyle = isGreece ? "background-color: rgba(59, 130, 246, 0.1); font-weight: 700;" : "";
      
      initialHtml += `<tr style="${rowStyle}" class="border-b border-skin-line transition-colors hover:bg-skin-card" data-code="${code}">
        <td class="px-4 py-3">${zoneNames[code]}</td>
        <td class="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-semibold" id="today-${code}">
          <svg class="animate-spin inline h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </td>
        <td class="px-4 py-3 text-right text-skin-base opacity-70 font-medium" id="prev-${code}">...</td>
        <td class="px-4 py-3 text-sm opacity-60 text-center">ENTSO-E</td>
      </tr>`;
    });
    tbody.innerHTML = initialHtml;

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const getProxyUrl = (targetUrl) => {
      return isLocalhost 
        ? `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
        : `/api/energy-proxy?target=${encodeURIComponent(targetUrl)}`;
    };

    // 🔥 UPGRADED FETCH: Now rejects empty arrays and breaks the cache!
    async function fetchWithRetry(targetUrl, maxRetries = 4) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (!isPageActive) return null; 
        try {
          // If we failed before, append a random timestamp to bypass the Cloudflare cache
          const urlToFetch = attempt > 1 ? `${targetUrl}&cb=${Date.now()}` : targetUrl;
          
          const res = await fetch(getProxyUrl(urlToFetch));
          
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, attempt * 3000));
            continue; 
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const data = await res.json();
          
          // REJECT EMPTY DATA!
          if (!data || !data.price || data.price.length === 0) {
            console.warn(`⚠️ API returned empty data for ${targetUrl}. Bypassing cache to try again...`);
            throw new Error("EmptyData");
          }
          
          return data;
        } catch (err) {
          if (attempt === maxRetries) {
            if (err.message === "EmptyData") return null; // Finally give up and show N/A
            throw err; // Show Σφάλμα
          }
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    function sortTable() {
      if (!isPageActive) return;
      const rows = Array.from(tbody.querySelectorAll("tr"));
      rows.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price) || 9999;
        const priceB = parseFloat(b.dataset.price) || 9999;
        return priceA - priceB;
      });
      tbody.append(...rows);
    }

    (async function processQueue() {
      try {
        for (const code of zonesArr) {
          if (!isPageActive) return; 
          
          const td = document.getElementById(`today-${code}`);
          const row = td.closest('tr');
          try {
            const data = await fetchWithRetry(`https://api.energy-charts.info/price?bzn=${code}`);
            if (data && data?.price?.length > 0) {
              const avg = data.price.reduce((a, b) => a + b, 0) / data.price.length;
              td.innerText = avg.toFixed(2) + " €";
              row.dataset.price = avg;
            } else {
              td.innerText = "N/A";
            }
          } catch (err) {
            td.innerText = "Σφάλμα";
          }
          await new Promise(r => setTimeout(r, 300)); 
        }
        
        if (isPageActive) sortTable();

        for (const code of zonesArr) {
          if (!isPageActive) return; 
          
          const td = document.getElementById(`prev-${code}`);
          try {
            const data = await fetchWithRetry(`https://api.energy-charts.info/price?bzn=${code}&start=${startStr}&end=${endStr}`);
            if (data && data?.price?.length > 0) {
              const avg = data.price.reduce((a, b) => a + b, 0) / data.price.length;
              td.innerText = avg.toFixed(2) + " €";
            } else {
              td.innerText = "N/A"; // If it still fails after 4 cache-busted retries, the data truly doesn't exist today.
            }
          } catch (err) {
            td.innerText = "Σφάλμα";
          }
          await new Promise(r => setTimeout(r, 800)); 
        }

      } catch (error) {
        console.error("Main fetch loop error:", error);
      }
    })();
  });
</script>
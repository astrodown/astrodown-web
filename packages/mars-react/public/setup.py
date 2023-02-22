import astrodown.js


astrodown_js = astrodown_js.to_py()
for export in astrodown_js["exports"]:
    globals()[export["name"]] = astrodown.js.load_export(export)

del globals()["export"]

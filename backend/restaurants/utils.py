def sort_by_type(results):
    res = {}
    for item in results:
        res.setdefault(item['type'], []).append(item)
    return res

def sort_by_category(results):
    menu_data = results.pop('dishes', None)
    res = {}
    if menu_data:
        for item in menu_data:
            res.setdefault(item['category'], []).append(item)
    return res
